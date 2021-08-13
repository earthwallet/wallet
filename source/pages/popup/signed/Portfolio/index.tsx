import React, { useEffect } from 'react';

import styles from './index.scss';
//import { useHistory } from 'react-router-dom';
const symbols = ['ICP', 'KSM', 'DOT', 'ETH', 'BNB', 'BTC', 'LTC', 'BCH'];
import Header from '~components/Header';
//import ICON_CHECKED from '~assets/images/icon_checkbox_checked.svg';
//import ICON_UNCHECKED from '~assets/images/icon_checkbox_unchecked.svg';
import ICON_ADD from '~assets/images/icon_addportfolio.svg';
import ICON_SCROLL from '~assets/images/icon_scrollable.svg';
import clsx from 'clsx';
import { getShortAddress } from '~utils/common';
import { useController } from '~hooks/useController';
import { useSelector } from 'react-redux';
import { AppState } from '~state/store';
import { IWalletState } from '~state/wallet/types';

const Page = () => {
  //const history = useHistory();
  const controller = useController();
  const { accounts }: IWalletState = useSelector(
    (state: AppState) => state.wallet
  );

  useEffect(() => {
    controller.accountsInfo();
  }, []);
  return (
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
          <div className={clsx(styles.headerIcon, styles.headerIconSecond)}>
            <img src={ICON_ADD} />
          </div>
        </div>
      </Header>

      <div className={styles.cards}>
        <div className={styles.cardcont}>
          <div className={styles.cardcontinner}>
            <div className={styles.cardinfo}>
              <div className={styles.pillet}>Earth Profile #</div>
              <div className={styles.value}>$XXXX.22</div>
              <div className={styles.stats}>+XX.34%</div>
            </div>
          </div>
          <div className={styles.cardnetworks}>
            <div className={styles.networktitle}>Networks</div>

            {accounts?.map((account, index) => (
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
      </div>
    </div>
  );
};

export default Page;
