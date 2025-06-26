import dayjs from 'dayjs';

import { prisma } from '../../prisma';
import { telegramService } from '../../services/telegramService';

export async function processWeeklyStats() {
  try {
    const now = dayjs();
    const weekAgo = now.subtract(7, 'days');
    const twoWeeksAgo = now.subtract(14, 'days');

    // Total users
    const totalUsers = await prisma.user.count();

    // Talent users (users with submissions or grant applications)
    const talentUsers = await prisma.user.count({
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
    });

    // Talent accounts that submitted at least 1 submission for the 2 past weeks
    const activeTalentUsers = await prisma.user.count({
      where: {
        Submission: {
          some: {
            createdAt: {
              gte: twoWeeksAgo.toDate(),
            },
          },
        },
      },
    });

    // Sponsor accounts
    const sponsorAccounts = await prisma.sponsors.count();

    // Sponsor members
    const sponsorMembers = await prisma.user.count({
      where: {
        currentSponsorId: {
          not: null,
        },
      },
    });

    // sponsor accounts with at least 1 active listing
    const activeSponsorAccounts = await prisma.sponsors.count({
      where: {
        Bounties: {
          some: {
            deadline: {
              gte: now.toDate(),
            },
            isPublished: true,
          },
        },
      },
    });

    // Total listings that were active
    const totalListings = await prisma.bounties.count({
      where: {
        isPublished: true,
      },
    });

    // Total public listings
    const totalPublicListings = await prisma.bounties.count({
      where: {
        isPublished: true,
        deadline: {
          gte: now.toDate(),
        },
        isWinnersAnnounced: false,
        isActive: true,
      },
    });

    // New listings this week
    const newListingsThisWeek = await prisma.bounties.count({
      where: {
        createdAt: {
          gte: weekAgo.toDate(),
        },
        isPublished: true,
      },
    });

    // Total Value Earned - using homepage calculation
    const totalEarned = await prisma.bounties.aggregate({
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
    });

    // Total comments
    const totalComments = await prisma.comment.count();

    // New comments this week
    const newCommentsThisWeek = await prisma.comment.count({
      where: {
        createdAt: {
          gte: weekAgo.toDate(),
        },
      },
    });

    const notAutomatedComments = await prisma.comment.count({
      where: {
        type: { not: { in: ['DEADLINE_EXTENSION', 'WINNER_ANNOUNCEMENT'] } },
      },
    });

    const notAutomatedCommentsThisWeek = await prisma.comment.count({
      where: {
        createdAt: {
          gte: weekAgo.toDate(),
        },
        type: { not: { in: ['DEADLINE_EXTENSION', 'WINNER_ANNOUNCEMENT'] } },
      },
    });

    // Total submissions
    const totalSubmissions = await prisma.submission.count();

    // New submissions this week
    const newSubmissionsThisWeek = await prisma.submission.count({
      where: {
        createdAt: {
          gte: weekAgo.toDate(),
        },
      },
    });

    const stats = {
      totalUsers,
      talentUsers,
      activeTalentUsers,
      sponsorAccounts,
      sponsorMembers,
      activeSponsorAccounts,
      totalListings,
      totalPublicListings,
      newListingsThisWeek,
      totalEarned: totalEarned._sum.usdValue,
      totalComments,
      newCommentsThisWeek,
      totalSubmissions,
      newSubmissionsThisWeek,
      notAutomatedComments,
      notAutomatedCommentsThisWeek,
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
