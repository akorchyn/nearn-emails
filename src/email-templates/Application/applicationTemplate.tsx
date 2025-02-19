import React from 'react';

import { Salutation } from '../../components/salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface ApplicationProps {
  name: string;
  applicationTitle: string;
  sponsorName: string;
}

export const ApplicationTemplate = ({
  name,
  applicationTitle,
  sponsorName,
}: ApplicationProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>

      <p style={styles.textWithMargin}>
        You have successfully submitted your grant application for{' '}
        <strong>{applicationTitle}</strong>. The team at {sponsorName} will
        review your application and get back to you if it is accepted.
      </p>

      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
