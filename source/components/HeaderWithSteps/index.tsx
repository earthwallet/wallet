import React from 'react';

import styles from './index.scss';
import Header from '../Header';

interface Props {
  className?: string;
  step: string|number;
  text: string;
  backOverride?: any;
}

const Component = ({ backOverride, className, step, text }: Props) => {
  return (
    <Header
      backOverride={backOverride}
      className={className}
      text={text}
      type={'wallet'}
    >
      <div className={styles.steps}>
        <div>
          <span className={styles.current}>{step}</span>
          <span className={styles.total}>/2</span>
        </div>
      </div>
    </Header>
  );
};

export default Component;
