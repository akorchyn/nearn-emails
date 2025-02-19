import React from 'react';

import { Salutation } from '../../components/salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { PROJECT_NAME } from '../../constants/project';
import { styles } from '../styles';

interface SubmissionProps {
  name: string;
  personName: string;
  link: string;
}

export const CommentTagTemplate = ({
  name,
  personName,
  link,
}: SubmissionProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hello&nbsp;{name},</p>
      <p style={styles.textWithMargin}>
        {personName} has tagged you in a comment on {PROJECT_NAME}.{' '}
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to check it out.
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
