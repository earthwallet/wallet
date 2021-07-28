import React, { FC, ReactNode } from 'react';

import styles from './index.scss';

interface ComponentProps {
    children: ReactNode;
}

const Component: FC<ComponentProps> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default Component;
