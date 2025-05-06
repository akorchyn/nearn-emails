import React from 'react';

import { Salutation } from '../../components/salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { PROJECT_NAME } from '../../constants/project';
import { styles } from '../styles';

interface TemplateProps {
  name: string | null;
  listingName: string;
  listingType: string;
  sponsorName: string;
  totalEarnings: number;
  pocSocials: string | null;
}

export const NonSTWinnersTemplate = ({
  name,
  listingName,
  listingType,
  sponsorName,
  totalEarnings,
  pocSocials,
}: TemplateProps) => {
  const formattedEarnings = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalEarnings);

  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Congrats your submission is approved for the{' '}
        <strong>{listingName}</strong> {listingType}!
      </p>
      <p style={styles.text}>
        {sponsorName} will be sending your reward directly into your wallet. No
        action is needed from your end. If you need to contact the sponsor, you
        can do so from{' '}
        <a
          href={`${pocSocials}/?utm_source=${PROJECT_NAME}&utm_medium=email&utm_campaign=notifications`}
          style={styles.link}
        >
          here
        </a>
        .
      </p>
      <p style={styles.textWithMargin}>
        With this approval, your total earnings have increased to{' '}
        {formattedEarnings}. We hope you keep pushing and receive more
        approvals!
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
