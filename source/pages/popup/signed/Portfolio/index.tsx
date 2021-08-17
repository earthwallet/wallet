import React, { useEffect, useState } from 'react';

import styles from './index.scss';
//import { useHistory } from 'react-router-dom';
const symbols = ['ETH', 'ICP', 'KSM', 'DOT', 'BNB', 'BTC', 'LTC', 'BCH'];
import Header from '~components/Header';
//import ICON_CHECKED from '~assets/images/icon_checkbox_checked.svg';
//import ICON_UNCHECKED from '~assets/images/icon_checkbox_unchecked.svg';
import ICON_ADD from '~assets/images/icon_addportfolio.svg';
import ICON_SCROLL from '~assets/images/icon_scrollable.svg';
import clsx from 'clsx';
import { getShortAddress, getShortText } from '~utils/common';
import { useController } from '~hooks/useController';
import { useSelector } from 'react-redux';
import { AppState } from '~state/store';
import { IWalletState } from '~state/wallet/types';
import { Link } from 'react-router-dom';
import { selectAccountGroups } from '~state/wallet';

const Page = () => {
  //const history = useHistory();
  const controller = useController();
  const { accounts }: IWalletState = useSelector(
    (state: AppState) => state.wallet
  );
  console.log(accounts);
  const [context, setContext] = useState(false);
  const accountGroups = useSelector(selectAccountGroups);
  console.log(accountGroups);

  const AccountsCard = (props: any) => <>
    <div className={styles.cardcont}>
      <div className={styles.cardcontinner}>
        <div className={styles.cardinfo}>
          <div className={styles.pillet}>
            {getShortText(props.accounts[0]?.meta?.name, 25) || props.index}
          </div>
          <div className={styles.value}>$XXXX.22</div>
          <div className={styles.stats}>+XX.34%</div>
        </div>
      </div>
      <div className={styles.cardnetworks}>
        <div className={styles.networktitle}>Networks</div>

        {props.accounts?.map((account: any, index: number) => (
          <div className={styles.netcard} key={index}>
            <div className={styles.networklogo}></div>
            <div className={styles.netmid}>
              <div className={styles.netname}>{symbols[index]}</div>
              <div className={styles.netassets}>
                {getShortAddress(account.address)}
              </div>
            </div>

            <div className={styles.netlast}>
              <div className={styles.netvalue}>$3X,0XX2.22 USD</div>
              <div className={styles.netstats}>+0.X4%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>


  useEffect(() => {
    controller.createOrUpdateAccounts();
  }, []);
  return (

    false ? (
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
        <div className={styles.cards} >
          {accountGroups?.map && accountGroups?.map((accounts: any, index: number) => <AccountsCard key={index} index={index} accounts={accounts} />)}
        </div>
      </div>
  );
};

export default Page;
