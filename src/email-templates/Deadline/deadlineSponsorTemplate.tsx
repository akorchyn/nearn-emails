import React from 'react';

import { Salutation } from '../../components/salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { PROJECT_NAME } from '../../constants/project';
import { styles } from '../styles';

interface TemplateProps {
  name: string;
  listingName: string;
  link: string;
}

export const DeadlineSponsorTemplate = ({
  name,
  listingName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        The deadline for your listing <strong>{listingName}</strong>
        &nbsp; has expired. We suggest you check for payments due and announce your next sponsorship on {PROJECT_NAME} soon!
      </p>
      <p style={styles.textWithMargin}>
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to review&nbsp;the submissions. &nbsp;
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
