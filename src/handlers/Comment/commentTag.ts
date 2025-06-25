import { CommentRefType } from '@prisma/client';
import { render } from '@react-email/render';

import { basePath } from '../../constants/basePath';
import { ceoEmail } from '../../constants/emails';
import { PROJECT_NAME } from '../../constants/project';
import { CommentTagTemplate } from '../../email-templates/Comment/commentTagTemplate';
import { prisma } from '../../prisma';
import { capitalizeWords } from '../../utils/capitalizeWords';
import { getCommentSourceURL } from '../../utils/comment';
import { getUserEmailPreference } from '../../utils/getUserEmailPreference';

export async function processCommentTag(
  id: string,
  userId: string,
  otherInfo: any,
) {
  const userPreference = await getUserEmailPreference(userId, 'commentTag');
  const type = otherInfo.type as CommentRefType;
  if (!CommentRefType[type]) {
    console.log('Invalid comment ref type', type);
    return;
  }

  if (!userPreference) {
    console.log(`User ${userId} has opted out of this type of email.`);
    return;
  }

  const { personName } = otherInfo;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const listing = await prisma.bounties.findFirst({
    where: { id },
    include: {
      poc: true,
    },
  });

  const link = getCommentSourceURL(basePath, type, listing, id).toString();

  if (user) {
    const emailHtml = await render(
      CommentTagTemplate({
        name: user?.name!,
        personName: capitalizeWords(personName),
        link,
      }),
    );

    const emailData = {
      from: ceoEmail,
      to: user?.email,
      subject: `You have been mentioned in a comment on ${PROJECT_NAME}`,
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
