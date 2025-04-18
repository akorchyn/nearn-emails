import React from 'react';

import { Salutation } from '../../components/salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { basePath } from '../../constants/basePath';
import { PROJECT_NAME } from '../../constants/project';
import { styles } from '../styles';

interface TemplateProps {
  name: string | null;
  amount: number;
  tokenName: string | null;
  walletAddress: string | null;
  username: string | null;
  isUSDbased: boolean;
}

export const PaymentReceivedTemplate = ({
  name,
  amount,
  tokenName,
  walletAddress,
  username,
  isUSDbased,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Do you know what just happened?! You just managed to turn your talent
        into some glorious crypto. Check your wallet — you should&apos;ve
        received {isUSDbased && '$'}{amount} {isUSDbased && 'paid in '}
        {tokenName} in your wallet address {walletAddress}.
        This isn&apos;t just a win; it&apos;s a testament to your talent and
        hard work.
      </p>
      <p style={styles.textWithMargin}>
        Also, we bet your network would love to hear about your success. Why not
        take a moment to admire the win on your profile and share it on Twitter?{' '}
        <a
          href={`${basePath}/t/${username}/?utm_source=${PROJECT_NAME}&utm_medium=email&utm_campaign=notifications`}
          style={styles.link}
        >
          Click here
        </a>{' '}
        to check it out, and tell the world about it!
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
