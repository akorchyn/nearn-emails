import { render } from '@react-email/render';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { basePath } from '../../constants/basePath';
import { ceoEmail } from '../../constants/emails';
import { PROJECT_NAME } from '../../constants/project';
import { DeadlineExceededbyWeekTemplate } from '../../email-templates/Deadline/deadlineExceededbyWeekTemplate';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils/getUserEmailPreference';

export async function processDeadlineExceededWeek() {
  dayjs.extend(utc);

  const sevenDaysAgo = dayjs.utc().subtract(7, 'day').toISOString();
  const nineDaysAgo = dayjs.utc().subtract(9, 'day').toISOString();

  const listings = await prisma.bounties.findMany({
    where: {
      isPublished: true,
      isActive: true,
      isArchived: false,
      status: 'OPEN',
      deadline: {
        lt: sevenDaysAgo,
        gte: nineDaysAgo,
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
        type: 'BOUNTY_DEADLINE_WEEK',
      },
    });

    if (checkLogs || !listing.poc?.email) continue;

    const pocPreference = await getUserEmailPreference(
      listing.pocId,
      'deadlineExceededWeek',
    );

    if (!pocPreference) continue;

    const emailHtml = await render(
      DeadlineExceededbyWeekTemplate({
        name: listing.poc.name!,
        listingName: listing.title,
        link: `${basePath}/dashboard/listings/${listing?.slug}/submissions/?utm_source=${PROJECT_NAME}&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    await prisma.emailLogs.create({
      data: {
        type: 'BOUNTY_DEADLINE_WEEK',
        bountyId: listing.id,
      },
    });

    emailData.push({
      from: ceoEmail,
      to: listing.poc.email,
      bcc: process.env.BCC_EMAILS?.split(',') || [],
      subject: `Winner Announcement for Your ${PROJECT_NAME} Bounty Is Due!`,
      html: emailHtml,
    });
  }

  return emailData.filter(Boolean);
}
