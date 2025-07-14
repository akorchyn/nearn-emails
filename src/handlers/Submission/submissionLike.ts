import { type BountyType } from '@prisma/client';
import { render } from '@react-email/render';
import dayjs from 'dayjs';

import { basePath } from '../../constants/basePath';
import { ceoEmail } from '../../constants/emails';
import { PROJECT_NAME } from '../../constants/project';
import { SubmissionLikeTemplate } from '../../email-templates/Submission/submissionLikeTemplate';
import { prisma } from '../../prisma';
import { getListingTypeLabel } from '../../utils/getListingTypeLabel';
import { getUserEmailPreference } from '../../utils/getUserEmailPreference';

function createFeedCardCopy(type: BountyType, isWinnersAnnounced: boolean) {
  const status = isWinnersAnnounced
    ? 'Win'
    : type === 'project'
      ? 'Application'
      : 'Submission';
  const prefix = getListingTypeLabel(type);
  return `${prefix} ${status}`;
}

export async function processSubmissionLike() {
  const now = dayjs();
  const twentyFourHoursAgo = now.subtract(24, 'hours');
  const twentyFourHoursAgoEpoch = twentyFourHoursAgo.valueOf();

  const submissions = await prisma.submission.findMany({
    where: {
      likeCount: {
        gt: 0,
      },
      updatedAt: {
        gte: twentyFourHoursAgo.toDate(),
      },
    },
    select: {
      userId: true,
      sequentialId: true,
      like: true,
      likeCount: true,
      isWinner: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      listing: {
        select: {
          title: true,
          sequentialId: true,
          sponsor: {
            select: {
              slug: true,
            },
          },
          isWinnersAnnounced: true,
          type: true,
          slug: true,
        },
      },
    },
  });

  const emailPromises = submissions.map(async (submission) => {
    const userPreference = await getUserEmailPreference(
      submission.userId,
      'submissionLike',
    );
    if (!userPreference) {
      console.log(
        `User ${submission.userId} has opted out of this type of email.`,
      );
      return null;
    }

    const likes = (submission.like as Array<{ date: number }> | null) || [];
    const newLikesCount = likes.filter(
      (like: { date: number }) => like.date >= twentyFourHoursAgoEpoch,
    ).length;

    if (newLikesCount === 0) return null;

    const type = createFeedCardCopy(
      submission.listing.type,
      submission.listing.isWinnersAnnounced,
    );

    const emailHtml = await render(
      SubmissionLikeTemplate({
        name: submission.user.name!,
        listingName: submission.listing.title,
        newLikesCount,
        type,
        listingLink: `${basePath}/${submission.listing.sponsor.slug}/${submission.listing.sequentialId}/${submission.sequentialId}/?utm_source=${PROJECT_NAME}&utm_medium=email&utm_campaign=notifications`,
        feedLink: `${basePath}/feed?utm_source=${PROJECT_NAME}&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    return {
      from: ceoEmail,
      to: submission.user.email,
      subject: `${newLikesCount} New ${newLikesCount === 1 ? 'Like' : 'Likes'} on Your ${type}`,
      html: emailHtml,
    };
  });

  const emailsToSend = (await Promise.all(emailPromises)).filter(Boolean);
  return emailsToSend;
}
