import React, { useState, useEffect } from 'react';

import styles from './index.scss';
import Header from '~components/Header';
import ICON_ADD from '~assets/images/icon_addportfolio.svg';
import ICON_SCROLL from '~assets/images/icon_scrollable.svg';
import clsx from 'clsx';
import { getShortAddress, getShortText, getSymbol } from '~utils/common';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectAccountGroups, selectBalanceByAddress } from '~state/wallet';
import { useHistory } from 'react-router-dom';
import { useController } from '~hooks/useController';
import { LIVE_SYMBOLS_GECKOIDs } from '~global/constant';
import { selectAssetBySymbol } from '~state/assets';

interface keyable {
  [key: string]: any;
}


const Portfolio = () => {
  const history = useHistory();
  const [context, setContext] = useState(false);
  const accountGroups = useSelector(selectAccountGroups);
  const controller = useController();


  useEffect((): void => {
    accountGroups.length !== 0 && controller.accounts
      .getBalancesOfAccountsGroup(accountGroups)
      .then(() => {
        controller.assets.fetchFiatPrices(LIVE_SYMBOLS_GECKOIDs);
      });
  }, [accountGroups.length !== 0]);



  const AccountsCard = ({ accounts, index }: { accounts: keyable, index: string | number }) => <>
    <div className={styles.cardcont}>
      <div className={styles.cardcontinner}>
        <div className={styles.cardinfo}>
          <div className={styles.pillet}>
            {getShortText(accounts[0]?.meta?.name, 25) || index}
          </div>
          <div className={styles.value}>${accounts[0]?.portfolioBalance || 0}</div>
          {/*           <div className={styles.stats}>+4.34%</div>
 */}        </div>
      </div>
      <div className={styles.cardnetworks}>
        <div className={styles.networktitle}>Networks</div>

        {accounts?.map((account: any, index: number) => (
          <div
            onClick={() => history.push('/account/details/' + account.id)}
            className={styles.netcard} key={index}>
            <div className={styles.networklogo}>
              <img src={getSymbol(account.symbol)?.icon} />
            </div>
            <div className={styles.netmid}>
              <div className={styles.netname}>{getShortAddress(account.address)}</div>
              {/*   <div className={styles.netassets}>
                3 assets
              </div> */}
            </div>

            {/* <div className={styles.netlast}>
              <div className={styles.netvalue}><Balance account={account} /></div>
              <div className={styles.netstats}>$0.24</div>
            </div> */}
            <BalanceWithUSD account={account} />
          </div>
        ))}
      </div>
    </div>
  </>


  return (
    accountGroups.length === 0 ? (
      <div className={styles.pageFirstTime}>
        <div className={styles.subtitle}>bringing crypto back to earth</div>
        <div className={styles.noAccountsActions}>
          <div className={styles.earthButtonCont}>
            <Link className={styles.link} to={'/account/create'}>
              <div className={styles.earthButton}>Create new Portfolio</div>
            </Link>
          </div>
          <div className={styles.footerCont}>
            <div className={styles.orSep}>or</div>
            <Link className={styles.link} to={'/account/import'}>
              <div className={styles.earthLink}>import seed phrase</div>
            </Link>
          </div>
        </div>
      </div>
    ) :
      <div className={styles.page}>
        <Header
          showBackArrow={false}
          className={styles.header}
          showAccountsDropdown={false}
          text={'Accounts'}
          type={'details'}
        >
          <div className={styles.headerIcons}>
            <div className={clsx(styles.headerIcon, styles.headerIconFirst, styles.noop)}>
              <img src={ICON_SCROLL} />
            </div>
            <div
              onClick={() => setContext(true)}
              className={clsx(styles.headerIcon, styles.headerIconSecond)}>
              <img src={ICON_ADD} />
            </div>
            {context && <div className={clsx(styles.headerContext)}>
              <Link className={styles.link} to={'/account/create'}>
                <div className={clsx(styles.headerContextLink)}>Create new Porfolio</div>
              </Link>
              <Link className={styles.link} to={'/account/import'}>
                <div className={clsx(styles.headerContextLink)}>Import Seed</div>
              </Link>
            </div>}
          </div>
        </Header>
        <div className={styles.cards}>
          {accountGroups?.sort((a, b) => (b[0].meta.createdAt - a[0].meta.createdAt)).map && accountGroups?.map((accounts: any, index: number) => <AccountsCard key={index} index={index} accounts={accounts} />)}
        </div>
      </div>
  );
};

const Balance = ({ account }: { account: keyable }) => {
  const currentBalance: keyable = useSelector(selectBalanceByAddress(account.address));

  return <div>{(currentBalance?.value || 0) / Math.pow(10, currentBalance?.currency?.decimals)} {account.symbol}</div>
}

const BalanceWithUSD = ({ account }: { account: keyable }) => {
  const currentBalance: keyable = useSelector(selectBalanceByAddress(account?.address));
  const currentUSDValue: keyable = useSelector(selectAssetBySymbol(getSymbol(account?.symbol)?.coinGeckoId || ''));
  const [usdValue, setUsdValue] = useState<number>(0);


  useEffect(() => {
    console.log('useEffect', currentUSDValue);

    const decimals = currentBalance?.currency?.decimals;
    const _usdValue = ((currentBalance?.value / Math.pow(10, decimals)) * parseFloat(currentUSDValue?.usd));
    setUsdValue(_usdValue);
  }, [currentBalance?.value !== null, currentUSDValue?.usd !== null]);
  return <div className={styles.netlast}>
    <div className={styles.netvalue}><Balance account={account} /></div>
    <div className={styles.netstats}>${usdValue?.toFixed(3)}<span className={currentUSDValue?.usd_24h_change > 0 ? styles.netstatspositive : styles.netstatsnegative}>{currentUSDValue?.usd_24h_change?.toFixed(2)}%</span></div>
  </div>
}


export default Portfolio;
