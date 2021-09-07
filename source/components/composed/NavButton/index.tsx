import { ButtonProps } from '@material-ui/core';
import React, { FC, ReactNode } from 'react';
import Button from '~components/based/Button';

import styles from './index.scss';

interface NavButtonProps extends Partial<ButtonProps> {
  children: ReactNode;
}

const NavButton: FC<NavButtonProps> = ({ children, ...otherProps }) => {
  return (
    <Button customClass={styles.navButton} {...otherProps}>
      {children}
    </Button>
  );
};

export default NavButton;
