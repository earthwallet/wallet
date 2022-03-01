
import React from 'react';
import styles from './index.scss';

import Header from '~components/Header';

import { RouteComponentProps, withRouter } from 'react-router';
import ICON_MINT from '~assets/images/icon_mint.svg';
import ICON_STAKE from '~assets/images/th/stake.svg';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { selectTokenByTokenPair } from '~state/token';
import { useSelector } from 'react-redux';
import { getTokenInfo } from '~global/tokens';

interface Props extends RouteComponentProps<{ address: string, tokenId: string }> {
}


const TokenHistory = ({
  match: {
    params: { address, tokenId },
  },
}: Props) => {

  console.log(address);
  const history = useHistory();
  const tokenInfo = getTokenInfo(tokenId);
  const tokenPair = useSelector(selectTokenByTokenPair(address + "_WITH_" + tokenId));
  console.log(tokenPair, tokenInfo);
  return (
    <div className={styles.page}>
      <Header
        type={'wallet'}
        text={tokenInfo?.name}
      ><div className={styles.empty} /></Header>
      <div>
        <div className={styles.top}>
        </div>

        <div className={styles.section}>
          {tokenInfo?.logo
            ? <img className={styles.icon_earth} src={tokenInfo?.logo} />
            : <div className={styles.icon_earth}>{tokenInfo?.name?.charAt(0)}
            </div>}
          <div className={styles.sectitle}>{tokenPair?.balanceTxt} {tokenInfo?.symbol}</div>
          <div className={styles.secsubtitle}>${tokenPair.price}</div>
        </div>
        <div className={styles.cta}>
          <div
            onClick={() => history.push('/swap/' + address + "/" + tokenId + '?type=mint')}
            className={styles.btnprimary}>
            <img src={ICON_MINT} className={styles.btnicon} />
            <div className={styles.btntxt}>Mint</div>
          </div>
          {false && <div
            onClick={() => history.push('/stake/' + address + "/" + tokenId)}
            className={clsx(styles.btnprimary, styles.btnsecondary)}>
            <img src={ICON_STAKE} className={styles.btnicon} />
            <div className={styles.btntxt}>Stake</div>
          </div>}
        </div>
        {/*  <div className={styles.graphcont}>
          <div className={styles.graph}></div>

        </div>
        <div className={styles.tabs}>
          {['24h', '7d', '14d', '30d', '90d', '1y', 'All'].map((tab, index) => <div
            key={index}
            className={clsx(styles.tab, index === 0 && styles.tab_active)}
          >
            {tab}
          </ div>)}
        </div> */}
        <div className={styles.stats}>
          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.key}>Market Cap</div>
              <div className={styles.val}>$12B</div>
            </div>
            <div className={styles.col}>
              <div className={styles.key}>Trading Volume</div>
              <div className={styles.val}>$433M</div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.key}>Supply</div>
              <div className={styles.val}>∞ Unlimited</div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.key}>Max Supply</div>
              <div className={styles.val}>1.0B</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default withRouter(TokenHistory);