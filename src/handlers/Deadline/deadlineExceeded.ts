import { render } from '@react-email/render';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { basePath } from '../../constants/basePath';
import { ceoEmail } from '../../constants/emails';
import { PROJECT_NAME } from '../../constants/project';
import { DeadlineSponsorTemplate } from '../../email-templates/Deadline/deadlineSponsorTemplate';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils/getUserEmailPreference';

export async function processDeadlineExceeded() {
  dayjs.extend(utc);

  const currentTime = dayjs.utc();

  const listings = await prisma.bounties.findMany({
    where: {
      isPublished: true,
      isActive: true,
      isArchived: false,
      status: 'OPEN',
      deadline: {
        lt: currentTime.toISOString(),
        gte: currentTime.subtract(1, 'day').toISOString(),
      },
      isWinnersAnnounced: false,
    },
    include: {
      poc: true,
    },
  });

  const emailData = [];

  for (const listing of listings) {
    const checkLogs = await prisma.emailLogs.findFirst({
      where: {
        bountyId: listing.id,
        type: 'BOUNTY_DEADLINE',
      },
    });

    if (checkLogs || !listing.poc?.email) continue;

    const pocPreference = await getUserEmailPreference(
      listing.pocId,
      'deadlineExceeded',
    );

    if (!pocPreference) continue;

    const emailHtml = await render(
      DeadlineSponsorTemplate({
        name: listing.poc.name!,
        listingName: listing.title,
        link: `${basePath}/dashboard/listings/${listing?.slug}/submissions/?utm_source=${PROJECT_NAME}&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    await prisma.emailLogs.create({
      data: {
        type: 'BOUNTY_DEADLINE',
        bountyId: listing.id,
      },
    });

    emailData.push({
      from: ceoEmail,
      to: listing.poc.email,
      bcc: process.env.BCC_EMAILS?.split(',') || [],
      subject: `Your ${PROJECT_NAME} Listing Is Ready to Be Reviewed`,
      html: emailHtml,
    });
  }

  return emailData.filter(Boolean);
}
