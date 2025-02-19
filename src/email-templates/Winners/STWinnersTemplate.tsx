import React from 'react';

import { Salutation } from '../../components/salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface TemplateProps {
  name: string | null;
  listingName: string;
  listingType: string;
}

export const STWinnersTemplate = ({
  name,
  listingName,
  listingType,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Congrats on winning the <strong>{listingName}</strong> {listingType}!
        You must fill out{' '}
        <a href={process.env.AIRTABLE_FORM_URL} style={styles.link}>
          this form
        </a>{' '}
        to receive your reward.
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
