
import React from 'react';
import styles from './index.scss';

import Header from '~components/Header';

import { RouteComponentProps, withRouter } from 'react-router';
import ICON_EARTH from '~assets/images/icon-512.png';
import ICON_SWAP from '~assets/images/icon_swap.png';
import ICON_STAKE from '~assets/images/icon_stake.png';
import clsx from 'clsx';

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
        text={'Earth'}
      ><div className={styles.empty} /></Header>
      <div>
        <div className={styles.top}>
        </div>

        <div className={styles.section}>
          <img className={styles.icon_earth} src={ICON_EARTH} />
          <div className={styles.sectitle}>1337 EARTH</div>
          <div className={styles.secsubtitle}>$4,092.22</div>
        </div>
        <div className={styles.cta}>
          <div className={styles.btnprimary}>
            <img src={ICON_SWAP} className={styles.btnicon} />
            <div className={styles.btntxt}>Swap</div>
          </div>
          <div className={clsx(styles.btnprimary, styles.btnsecondary)}>
            <img src={ICON_STAKE} className={styles.btnicon} />
            <div className={styles.btntxt}>Stake</div>
          </div>
        </div>
        <div className={styles.graphcont}>
          <div className={styles.graph}></div>

        </div>
        <div className={styles.tabs}>
          {['24h', '7d', '14d', '30d', '90d', '1y', 'All'].map((tab, index) => <div
            key={index}
            className={clsx(styles.tab, index === 0 && styles.tab_active)}
          >
            {tab}
          </ div>)}
        </div>
      </div>
    </div>
  );
};


export default withRouter(TokenHistory);