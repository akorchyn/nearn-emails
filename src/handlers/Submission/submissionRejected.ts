import { render } from '@react-email/render';

import { basePath } from '../../constants/basePath';
import { ceoEmail } from '../../constants/emails';
import { PROJECT_NAME } from '../../constants/project';
import { SubmissionRejectedTemplate } from '../../email-templates/Submission/submissionRejectedTemplate';
import { prisma } from '../../prisma';

export async function processSubmissionRejected(id: string) {
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      user: true,
      listing: {
        include: {
          sponsor: true,
        },
      },
    },
  });

  if (submission) {
    const emailHtml = await render(
      SubmissionRejectedTemplate({
        name: submission.user.firstName!,
        listingName: submission.listing.title,
        link: `${basePath}/listing/${submission.listing.slug}/?utm_source=${PROJECT_NAME}&utm_medium=email&utm_campaign=notifications`,
      }),
    );
    const emailData = {
      from: ceoEmail,
      to: submission?.user.email,
      subject: `About your recent application to ${submission.listing.sponsor.name}'s gig`,
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
