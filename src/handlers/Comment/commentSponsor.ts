import { render } from '@react-email/render';

import { basePath } from '../../constants/basePath';
import { ceoEmail } from '../../constants/emails';
import { PROJECT_NAME } from '../../constants/project';
import { CommentSponsorTemplate } from '../../email-templates/Comment/commentSponsorTemplate';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils/getUserEmailPreference';

export async function processCommentSponsor(id: string, userId: string) {
  const userPreference = await getUserEmailPreference(userId, 'commentSponsor');

  if (!userPreference) {
    console.log(`User ${userId} has opted out of this type of email.`);
    return;
  }

  const listing = await prisma.bounties.findFirst({
    where: { id },
    include: {
      poc: true,
    },
  });

  if (listing) {
    const pocUser = listing?.poc;

    const emailHtml = await render(
      CommentSponsorTemplate({
        name: pocUser.name!,
        listingName: listing.title,
        link: `${basePath}/listing/${listing?.slug}/?utm_source=${PROJECT_NAME}&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    const emailData = {
      from: ceoEmail,
      to: pocUser.email,
      subject: `Comment Received on Your ${PROJECT_NAME} Listing`,
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
