
import React from 'react';
import styles from './index.scss';

import Header from '~components/Header';

import { RouteComponentProps, withRouter } from 'react-router';
import ICON_MINT from '~assets/images/icon_mint.svg';
import ICON_STAKE from '~assets/images/th/stake.svg';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { selectInfoBySymbolOrToken } from '~state/tokens';
import { useSelector } from 'react-redux';
import icon_rec from '~assets/images/icon_rec.svg';
import icon_send from '~assets/images/icon_send.svg';
import { selectAccountById } from '~state/wallet';
interface Props extends RouteComponentProps<{ accountId: string, symbolOrTokenId: string }> {
}


const TokenDetailsWithInfo = ({
  match: {
    params: { accountId, symbolOrTokenId },
  },
}: Props) => {

  const selectedAccount = useSelector(selectAccountById(accountId));
  const { address } = selectedAccount;

  const history = useHistory();
  const symbolOrTokenInfo = useSelector(selectInfoBySymbolOrToken(symbolOrTokenId, address));


  return (
    <div className={styles.page}>
      <Header
        type={'wallet'}
        text={symbolOrTokenInfo?.name}
      ><div className={styles.empty} /></Header>
      <div className={styles.body}>
        <div className={styles.section}>
          {symbolOrTokenInfo?.icon
            ? <img className={styles.icon_earth} src={symbolOrTokenInfo?.icon} />
            : <div className={styles.icon_earth}>{symbolOrTokenInfo?.name?.charAt(0)}
            </div>}
          <div className={styles.sectitle}>{symbolOrTokenInfo?.balanceTxt || 0} {symbolOrTokenInfo?.symbol}</div>
          <div className={styles.secsubtitle}>${symbolOrTokenInfo?.price || 0}</div>
        </div>
        <div className={styles.cta}>

          {symbolOrTokenInfo.symbol == 'SDR' && (<div
            onClick={() => history.push('/swap/' + address + "/" + symbolOrTokenId + '?type=mint')}
            className={styles.btnprimary}>
            <img src={ICON_MINT} className={styles.btnicon} />
            <div className={styles.btntxt}>Mint</div>
          </div>)}
          {false && <div
            onClick={() => history.push('/stake/' + address + "/" + symbolOrTokenId)}
            className={clsx(styles.btnprimary, styles.btnsecondary)}>
            <img src={ICON_STAKE} className={styles.btnicon} />
            <div className={styles.btntxt}>Stake</div>
          </div>}
          <div
            onClick={() => history.push("/account/receive/" + address + "/" + symbolOrTokenId)}
            className={styles.btnprimary}>
            <img className={styles.btnicon} src={icon_rec} />
            <div className={styles.btntxt}>Receive</div>
          </div>
          <div
            onClick={() => history.push(symbolOrTokenInfo?.type == 'symbol' ? "/account/send/" + address : "/account/send/" + address + "?tokenId=" + symbolOrTokenId)}
            className={styles.btnprimary}>
            <img className={styles.btnicon} src={icon_send} />
            <div className={styles.btntxt}>Send</div>
          </div>
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
          {symbolOrTokenInfo.usd_market_cap && <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.key}>Market Cap</div>
              <div className={styles.val}>${symbolOrTokenInfo.usd_market_cap}</div>
            </div>
            {symbolOrTokenInfo.usd_24h_vol && <div className={styles.col}>
              <div className={styles.key}>24h Volume</div>
              <div className={styles.val}>${symbolOrTokenInfo.usd_24h_vol}</div>
            </div>}
          </div>}
          {/*     <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.key}>Supply</div>
              <div className={styles.val}>∞ Unlimited</div>
            </div>
          </div> */}
          {symbolOrTokenInfo?.totalSupply && <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.key}>Max Supply</div>
              <div className={styles.val}>{symbolOrTokenInfo?.totalSupply == 'Infinite' ? '∞ Unlimited' : symbolOrTokenInfo.totalSupply}</div>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
};


export default withRouter(TokenDetailsWithInfo);