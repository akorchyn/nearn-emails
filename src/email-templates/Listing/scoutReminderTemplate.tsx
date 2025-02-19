import React from 'react';

import { Salutation } from '../../components/salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { PROJECT_NAME } from '../../constants/project';
import { styles } from '../styles';

interface ScoutReminderProps {
  name: string;
  link: string;
  listingName: string;
  invitesLeft: number;
  totalMatchedUSD: number;
  type: string;
}

export const ScoutReminderTemplate = ({
  name,
  link,
  listingName,
  invitesLeft,
  totalMatchedUSD,
  type,
}: ScoutReminderProps) => {
  const formatNumber = (number: number) =>
    new Intl.NumberFormat('en-US').format(number);
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.text}>
        If you haven't tried {PROJECT_NAME} Scout yet for {type} {listingName},{' '}
        {`you're`} <strong>missing out on the best talent</strong> on{' '}
        {PROJECT_NAME}. This elite group of users, handpicked for your {type},
        has earned a total of ${formatNumber(totalMatchedUSD)} from similar work
        on {PROJECT_NAME}!
      </p>
      <p style={styles.textWithMargin}>
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to review the profiles of these chads and invite them. {invitesLeft}{' '}
        invites left!
      </p>

      <Salutation />
      <p style={styles.text}>&nbsp;</p>
      <UnsubscribeLine />
    </div>
  );
};
