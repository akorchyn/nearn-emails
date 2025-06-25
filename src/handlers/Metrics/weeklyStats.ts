import dayjs from 'dayjs';

import { prisma } from '../../prisma';
import { telegramService } from '../../services/telegramService';

export async function processWeeklyStats() {
  try {
    const now = dayjs();
    const weekAgo = now.subtract(7, 'days');
    const twoWeeksAgo = now.subtract(14, 'days');

    const [
      totalUsers,
      talentUsers,
      activeTalentUsers,
      sponsorAccounts,
      sponsorMembers,
      activeSponsorAccounts,
      totalListings,
      totalPublicListings,
      newListingsThisWeek,
      totalEarned,
      totalComments,
      newCommentsThisWeek,
      totalSubmissions,
      newSubmissionsThisWeek,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // Talent users (users with submissions or grant applications)
      prisma.user.count({
        where: {
          OR: [
            {
              Submission: {
                some: {},
              },
            },
            {
              GrantApplication: {
                some: {},
              },
            },
          ],
        },
      }),

      // Talent accounts that submitted at least 1 submission for the 2 past weeks
      prisma.user.count({
        where: {
          Submission: {
            some: {
              createdAt: {
                gte: twoWeeksAgo.toDate(),
              },
            },
          },
        },
      }),

      // Sponsor accounts
      prisma.sponsors.count(),

      // Sponsor members
      prisma.user.count({
        where: {
          currentSponsorId: {
            not: null,
          },
        },
      }),

      // sponsor accounts with at least 1 active listing
      prisma.bounties.aggregate({
        where: {
          status: 'OPEN',
          isActive: true,
        },
        _count: {
          sponsorId: true,
        },
      }),

      // Total listings that were active
      prisma.bounties.count({
        where: {
          isPublished: true,
        },
      }),

      // Total public listings
      prisma.bounties.count({
        where: {
          isPublished: true,
          deadline: {
            gte: now.toDate(),
          },
          isWinnersAnnounced: false,
          isActive: true,
        },
      }),

      // New listings this week
      prisma.bounties.count({
        where: {
          createdAt: {
            gte: weekAgo.toDate(),
          },
          isPublished: true,
        },
      }),

      // Total Value Earned - using homepage calculation
      prisma.bounties.aggregate({
        _sum: {
          usdValue: true,
        },
        where: {
          OR: [
            {
              isWinnersAnnounced: true,
            },
            {
              type: 'sponsorship',
            },
          ],
          isPublished: true,
          status: 'OPEN',
        },
      }),

      // Total comments
      prisma.comment.count(),

      // New comments this week
      prisma.comment.count({
        where: {
          createdAt: {
            gte: weekAgo.toDate(),
          },
        },
      }),

      // Total submissions
      prisma.submission.count(),

      // New submissions this week
      prisma.submission.count({
        where: {
          createdAt: {
            gte: weekAgo.toDate(),
          },
        },
      }),
    ]);

    const stats = {
      totalUsers,
      talentUsers,
      activeTalentUsers,
      sponsorAccounts,
      sponsorMembers,
      activeSponsorAccounts: activeSponsorAccounts._count.sponsorId,
      totalListings,
      totalPublicListings,
      newListingsThisWeek,
      totalEarned: totalEarned._sum.usdValue,
      totalComments,
      newCommentsThisWeek,
      totalSubmissions,
      newSubmissionsThisWeek,
    };

    // Send to telegram
    const success = await telegramService.sendWeeklyStats(stats);

    if (success) {
      console.log('Weekly stats sent to telegram successfully');
    } else {
      console.error('Failed to send weekly stats to telegram');
    }

    return success;
  } catch (error) {
    console.error('Error processing weekly stats:', error);
    return false;
  }
}
