import { render } from '@react-email/render';

import { basePath } from '../../constants/basePath';
import { ceoEmail } from '../../constants/emails';
import { PROJECT_NAME } from '../../constants/project';
import { VerifiedStatusTemplate } from '../../email-templates/Listing/verifiedStatusTemplate';
import { prisma } from '../../prisma';

export async function processVerifiedStatus(
  id: string,
  _: string,
  otherInfo: any,
) {
  const { decision } = otherInfo as { decision: 'approve' | 'reject' };

  if (decision !== 'approve' && decision !== 'reject') {
    console.error('Decision must be approve or reject');
    return null;
  }

  const listing = await prisma.bounties.findFirst({
    where: { id },
    include: { sponsor: true, poc: true },
  });

  if (!listing) {
    console.error(`No listing found with the provided ID: ${id}`);
    return null;
  }

  const verifiedStatusRender = VerifiedStatusTemplate({
    name: listing.poc.firstName!,
    listingName: listing.title,
    listingType: listing.type,
    link: `${basePath}/listing/${listing.slug}/?utm_source=${PROJECT_NAME}&utm_medium=email&utm_campaign=notifications`,
    decision,
  });

  if (!verifiedStatusRender) {
    console.error('VerifiedStatusTemplate did not return valid template');
    return null;
  }
  const emailHtml = await render(verifiedStatusRender);

  const subject =
    decision === 'approve'
      ? `Your ${PROJECT_NAME} listing has been verified and published`
      : `Your ${PROJECT_NAME} listing could not be published`;
  const emailData = {
    from: ceoEmail,
    to: listing.poc.email,
    subject,
    html: emailHtml,
    checkUnsubscribe: false,
  };

  return emailData;
}
