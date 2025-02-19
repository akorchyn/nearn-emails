import React from 'react';

import { PROJECT_NAME } from '../constants/project';
import { styles } from '../email-templates/styles';

export const Salutation = () => {
  return (
    <p style={styles.salutation}>
      Best,
      <br />
      {PROJECT_NAME}
    </p>
  );
};
