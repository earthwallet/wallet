import React, { FC, ReactNode } from 'react';
import BaseButton, {
  ButtonProps as BaseButtonProps,
} from '@material-ui/core/Button';
import clsx from 'clsx';

import styles from './index.scss';

interface ButtonProps extends Partial<BaseButtonProps> {
  children: ReactNode;
  customClass?: string;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  disabled,
  customClass,
  ...props
}) => {
  const classes = clsx(
    styles.button,
    { [styles.disabled]: disabled },
    customClass
  );

  return (
    <BaseButton className={classes} {...props}>
      {children}
    </BaseButton>
  );
};

export default Button;
