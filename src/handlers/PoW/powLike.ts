import { render } from '@react-email/render';
import dayjs from 'dayjs';

import { basePath } from '../../constants/basePath';
import { ceoEmail } from '../../constants/emails';
import { PROJECT_NAME } from '../../constants/project';
import { PoWLikeTemplate } from '../../email-templates/PoW/powLike';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils/getUserEmailPreference';

export async function processPoWLike() {
  const now = dayjs();
  const twentyFourHoursAgo = now.subtract(24, 'hours');
  const twentyFourHoursAgoEpoch = twentyFourHoursAgo.valueOf();

  const proofOfWorks = await prisma.poW.findMany({
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
      like: true,
      likeCount: true,
      title: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const emailPromises = proofOfWorks.map(async (proofOfWork) => {
    const userPreference = await getUserEmailPreference(
      proofOfWork.userId,
      'powLike',
    );
    if (!userPreference) {
      console.log(
        `User ${proofOfWork.userId} has opted out of this type of email.`,
      );
      return null;
    }

    const likes = (proofOfWork.like as Array<{ date: number }> | null) || [];
    const newLikesCount = likes.filter(
      (like: { date: number }) => like.date >= twentyFourHoursAgoEpoch,
    ).length;

    console.log('new like count - ', newLikesCount);
    if (newLikesCount === 0) return null;

    const emailHtml = await render(
      PoWLikeTemplate({
        name: proofOfWork.user.name!,
        powName: proofOfWork.title,
        newLikesCount,
        feedLink: `${basePath}/feed?utm_source=${PROJECT_NAME}&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    return {
      from: ceoEmail,
      to: proofOfWork.user.email,
      subject: `${newLikesCount} New ${newLikesCount === 1 ? 'Like' : 'Likes'} on Your Personal Project!`,
      html: emailHtml,
    };
  });

  const emailsToSend = (await Promise.all(emailPromises)).filter(Boolean);
  return emailsToSend;
}
