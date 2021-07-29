import React, { useEffect, useState } from 'react';

import styles from './index.scss';
//import { useHistory } from 'react-router-dom';
import { createWallet, EarthKeyringPair } from '@earthwallet/sdk';
const symbols = ['ICP', 'KSM', 'DOT', 'ETH', "BNB", "BTC", "LTC", "BCH"];
import Header from '~components/Header';
//import ICON_CHECKED from '~assets/images/icon_checkbox_checked.svg';
//import ICON_UNCHECKED from '~assets/images/icon_checkbox_unchecked.svg';
import ICON_ADD from '~assets/images/icon_addportfolio.svg';
import ICON_SCROLL from '~assets/images/icon_scrollable.svg';
import clsx from 'clsx';
import { getShortAddress } from '~utils/common';

const Page = () => {
  //const history = useHistory();
  const [accounts, setAccounts] = useState<EarthKeyringPair[] | null>();


  useEffect(() => {
    const loadTransactionDetails = async () => {

      /*    const walletObj = await createWallet(
           'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
           'ICP'
         ); */

      let newAccounts = [];

      for (const symbol of symbols) {
        const keypair = await createWallet(
          'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
          symbol
        );
        newAccounts.push(keypair);
        console.log(keypair, 'symbol v1', symbol);
      }

      console.log(newAccounts);
      setAccounts(newAccounts);
    }

    loadTransactionDetails();


  }, []);
  return <div className={styles.page}>
    <Header
      className={styles.header}
      showAccountsDropdown={false}
      text={'Accounts'}
      type={'details'}>
      <div className={styles.headerIcons}>
        <div
          className={clsx(styles.headerIcon, styles.headerIconFirst)}
        >
          <img src={ICON_SCROLL} />
        </div>
        <div
          className={clsx(styles.headerIcon, styles.headerIconSecond)}>
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

          {accounts?.map((account, index) => <div
            className={styles.netcard}
            key={index}>
            <div className={styles.networklogo}></div>
            <div className={styles.netmid}>
              <div className={styles.netname}>
                {symbols[index]}
              </div>
              <div className={styles.netassets}>
                {getShortAddress(account.address)}
              </div>
            </div>

            <div className={styles.netlast}>
              <div className={styles.netvalue}>
                $3X,0XX2.22 USD
              </div>
              <div className={styles.netstats}>
                +0.X4%
              </div>
            </div>
          </div>)}



        </div>
      </div>

    </div>
  </div>;
};

export default Page;
