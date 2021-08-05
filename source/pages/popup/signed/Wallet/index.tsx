import React, { useState } from 'react';
import styles from './index.scss';
import { Link } from 'react-router-dom';
import Header from '~components/Header';
import icpLogo from '~assets/images/icon_icp_details.png';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import CopyToClipboard from 'react-copy-to-clipboard';
//import bg_wallet_details from '~assets/images/bg_wallet_details.png';
import icon_copy from '~assets/images/icon_copy.svg';
import icon_rec from '~assets/images/icon_rec.svg';
import icon_send from '~assets/images/icon_send.svg';
import { getShortAddress } from '~utils/common';
import clsx from 'clsx';

const Page = () => {
  const loading = false;
  const [selectedTab, setSelectedTab] = useState('Transactions');
  //const _onCopy = useCallback((): void => show('Copied'), [show]);
  const _onCopy = console.log;

  const selectedAccount = { address: '5xxx', name: 'asdf' };
  return (
    <div className={styles.page}>
      <Header
        className={styles.header}
        showAccountsDropdown
        showMenu
        type={'wallet'}
      />
      <img className={styles.networklogo} src={icpLogo} />
      <div className={styles.networktext}>Internet Computer</div>
      <div className={styles.primaryBalanceLabel}>
        {loading ? (
          <SkeletonTheme color="#222" highlightColor="#000">
            <Skeleton width={150} />
          </SkeletonTheme>
        ) : (
          <div className={styles.primaryBalanceLabel}>{'0 ICP'}</div>
        )}
      </div>
      <div className={styles.secondaryBalanceLabel}>
        {loading ? (
          <SkeletonTheme color="#222" highlightColor="#000">
            <Skeleton width={100} />
          </SkeletonTheme>
        ) : (
          <span className={styles.secondaryBalanceLabel}>10</span>
        )}
      </div>

      <CopyToClipboard text={selectedAccount?.address || ''}>
        <div className={styles.copyActionsView} onClick={_onCopy}>
          <div className={styles.copyCont}>
            <div className={styles.copyName}>{selectedAccount?.name}</div>
            <div className={styles.copyAddress}>
              {getShortAddress(selectedAccount?.address || '')}
            </div>
          </div>
          <div className={styles.copyButton}>
            <img className={styles.iconCopy} src={icon_copy} />
          </div>
        </div>
      </CopyToClipboard>

      <div className={styles.walletActionsView}>
        <div
          className={clsx(styles.tokenActionView, styles.receiveTokenAction)}
        >
          <Link className={styles.transactionsCont} to="/wallet/receive">
            <div className={styles.tokenActionButton}>
              <img className={styles.iconActions} src={icon_rec} />
              <div className={styles.tokenActionLabel}>Receive</div>
            </div>
          </Link>
        </div>

        <div className={clsx(styles.tokenActionView, styles.sendTokenAction)}>
          <Link to="/wallet/send">
            <div className={styles.tokenActionButton}>
              <img className={styles.iconActions} src={icon_send} />
              <div className={styles.tokenActionLabel}>Send</div>
            </div>
          </Link>
        </div>
      </div>

      <Link
        to={`/wallet/transactions/d3e13d4777e22367532053190b6c6ccf57444a61337e996242b1abfb52cf92c8`}
      >
        <div className={styles.assetsAndActivityDiv}>
          <div className={styles.tabsPill}></div>
          <div className={styles.tabsView}>
            <div
              className={clsx(
                styles.tabView,
                selectedTab === 'Transactions' && styles.selectedTabView
              )}
            >
              Transactions {0}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Page;
