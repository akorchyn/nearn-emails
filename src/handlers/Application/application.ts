import { render } from '@react-email/render';

import { basePath } from '../../constants/basePath';
import { ceoEmail } from '../../constants/emails';
import { PROJECT_NAME } from '../../constants/project';
import { ApplicationSponsorTemplate } from '../../email-templates/Application/applicationSponsorTemplate';
import { ApplicationTemplate } from '../../email-templates/Application/applicationTemplate';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils/getUserEmailPreference';

export async function processApplication(id: string, userId: string) {
  const grantApplication = await prisma.grantApplication.findFirst({
    where: { id },
    include: {
      grant: {
        include: {
          sponsor: {
            select: {
              name: true,
            },
          },
          poc: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      },
    },
  });

  const user = await prisma.user.findFirst({
    where: { id: userId as string },
  });

  if (!grantApplication || !user) {
    return;
  }

  const emailData = [];

  const userPreferenceSponsor = await getUserEmailPreference(
    grantApplication?.grant?.pocId,
    'application',
  );

  if (userPreferenceSponsor) {
    const sponsorEmailHtml = await render(
      ApplicationSponsorTemplate({
        name: grantApplication?.grant?.poc?.name!,
        applicationTitle: grantApplication.projectTitle,
        grantName: grantApplication.grant.title,
        link: `${basePath}/dashboard/grants/${grantApplication.grant.slug}/applications/?utm_source=${PROJECT_NAME}&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    emailData.push({
      from: ceoEmail,
      to: grantApplication?.grant?.poc?.email,
      subject: 'New Grant Application Received',
      html: sponsorEmailHtml,
    });
  } else {
    console.log(`User ${userId} has opted out of sponsor type email.`);
  }

  const sponsorName = grantApplication.grant.sponsor.name;
  const talentEmailHtml = await render(
    ApplicationTemplate({
      name: user.name!,
      applicationTitle: grantApplication.projectTitle,
      sponsorName,
    }),
  );

  emailData.push({
    from: ceoEmail,
    to: user.email,
    subject: `${sponsorName} Has Received Your Grant Application`,
    html: talentEmailHtml,
  });

  return emailData;
}
