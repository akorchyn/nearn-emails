import React from 'react';

import { Salutation } from '../../components/salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { PROJECT_NAME, SUPPORT_EMAIL } from '../../constants/project';
import { styles } from '../styles';

interface TemplateProps {
  name: string;
  listingName: string;
  link: string;
}

export const DeadlineExceededbyWeekTemplate = ({
  name,
  listingName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        It has been 7 days since the <strong>{listingName}</strong> listing
        expired. We suggest you announce your selection/s on {PROJECT_NAME} soon!
      </p>
      <p style={styles.textWithMargin}>
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to review the submissions.
      </p>

      <p style={styles.textWithMargin}>
        Reach out to us on{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} style={styles.link}>
          {SUPPORT_EMAIL}
        </a>{' '}
        in case you need help.
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
