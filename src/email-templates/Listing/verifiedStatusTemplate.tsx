import React from 'react';

import { Salutation } from '../../components/salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { SUPPORT_EMAIL } from '../../constants/project';
import { styles } from '../styles';

interface Props {
  decision: 'approve' | 'reject';
  link: string;
  name: string;
  listingName: string;
  listingType: string;
}

export const VerifiedStatusTemplate = ({
  name,
  link,
  listingName,
  listingType,
  decision,
}: Props) => {
  if (decision === 'approve') {
    return (
      <div style={styles.container}>
        <p style={styles.greetings}>Hi {name},</p>
        <p style={styles.textWithMargin}>
          Your {listingType}{' '}
          <a href={link} style={styles.link}>
            {listingName}
          </a>{' '}
          has been verified by our team and published.
        </p>
        <p style={styles.text}>Thanks for your patience!</p>

        <Salutation />
        <p style={styles.text}>&nbsp;</p>
        <UnsubscribeLine />
      </div>
    );
  } else if (decision === 'reject') {
    return (
      <div style={styles.container}>
        <p style={styles.greetings}>Hi {name},</p>
        <p style={styles.textWithMargin}>
          Unfortunately, your {listingType}{' '}
          <a href={link} style={styles.link}>
            {listingName}
          </a>{' '}
          did not pass our due diligence review and, therefore, could not be
          published.
        </p>
        <p style={styles.text}>
          If you believe this decision was made in error, please don’t hesitate
          to contact us at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={styles.link}>
            {SUPPORT_EMAIL}
          </a>
          . We’re here to help.
        </p>

        <Salutation />
        <p style={styles.text}>&nbsp;</p>
        <UnsubscribeLine />
      </div>
    );
  }
};
