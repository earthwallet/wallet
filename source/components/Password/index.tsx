import React, { FC } from 'react';

import styles from './index.scss';

interface ComponentProps {
  some: boolean;
}

const Component: FC<ComponentProps> = () => {
  return <div className={styles.container}>Component</div>;
};

export default Component;
