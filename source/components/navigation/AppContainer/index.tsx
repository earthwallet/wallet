import React, { FC, ReactNode } from 'react';

import styles from './index.scss';

interface AppContainerProps {
  children: ReactNode;
}

const AppContainer: FC<AppContainerProps> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default AppContainer;
