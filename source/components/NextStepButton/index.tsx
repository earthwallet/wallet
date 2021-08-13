import { Button } from '@material-ui/core';
import React, { FC, ReactNode } from 'react';
import { ClipLoader } from 'react-spinners';
import clsx from 'clsx';

import styles from './index.scss';

interface ComponentProps {
    children: ReactNode;
    loading?: boolean;
}
type Props = React.ComponentProps<typeof Button> & ComponentProps;


const Component: FC<Props> = ({ children, ...props }: Props) => {
  return <div className={props.className}>
  <div
    className={(props.disabled ? styles.buttonDisabledCont : props.loading ? clsx(styles.buttonCont, styles.buttonContLoading) : styles.buttonCont) }
    onClick={props.onClick || console.log}
  >
    <div className={props.disabled ? styles.buttonDisabled : styles.button} >
      {props.loading
        ? <ClipLoader color={'#fffff'}
          size={15} />
        : children }
    </div>
  </div>
</div>;
};

export default Component;
