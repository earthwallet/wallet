import { ButtonProps } from '@material-ui/core';
import clsx from 'clsx';
import React, { FC, ReactNode } from 'react';
import Button from '~components/based/Button';

import styles from './index.scss';

interface ActionButtonProps extends Partial<ButtonProps> {
  children: ReactNode;
  actionType?: 'primary' | 'secondary';
}

const ActionButton: FC<ActionButtonProps> = ({
  children,
  actionType = 'primary',
  ...otherProps
}) => {
  return (
    <Button
      customClass={clsx(styles.actionButton, styles[actionType])}
      {...otherProps}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
