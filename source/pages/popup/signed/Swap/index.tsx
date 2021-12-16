
import React from 'react';
import styles from './index.scss';

import Header from '~components/Header';

import { RouteComponentProps, withRouter } from 'react-router';
interface Props extends RouteComponentProps<{ address: string }> {
}


const TokenHistory = ({
  match: {
    params: { address },
  },
}: Props) => {

  console.log(address);

  return (
    <div className={styles.page}>
      <Header
        type={'wallet'}
        text={'Swap'}
      ><div className={styles.empty} /></Header>
    </div>
  );
};


export default withRouter(TokenHistory);