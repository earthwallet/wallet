import React, { useEffect, useState } from 'react';
import styles from './index.scss';
import { Link } from 'react-router-dom';
import Header from '~components/Header';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import CopyToClipboard from 'react-copy-to-clipboard';
//import bg_wallet_details from '~assets/images/bg_wallet_details.png';
import icon_copy from '~assets/images/icon_copy.svg';
import icon_rec from '~assets/images/icon_rec.svg';
import icon_send from '~assets/images/icon_send.svg';
import { getShortAddress, getSymbol } from '~utils/common';
import clsx from 'clsx';
import { RouteComponentProps, withRouter } from 'react-router';
import { useSelector } from 'react-redux';
import { selectAccountById } from '~state/wallet';
import { getTransactions } from '@earthwallet/keyring';
import { useController } from '~hooks/useController';
import { selectBalanceByAddress } from '~state/wallet';
import { selectAssetBySymbol } from '~state/assets';


interface Props extends RouteComponentProps<{ address: string }> {
}
interface keyable {
  [key: string]: any
}

const Wallet = ({
  match: {
    params: { address },
  },
}: Props) => {

  const controller = useController();

  //const _onCopy = useCallback((): void => show('Copied'), [show]);
  const _onCopy = console.log;


  const selectedAccount = useSelector(selectAccountById(address));


  const currentBalance: keyable = useSelector(selectBalanceByAddress(address));
  const currentUSDValue: keyable = useSelector(selectAssetBySymbol(getSymbol(selectedAccount?.symbol)?.coinGeckoId || ''));

  const [walletTransactions, setWalletTransactions] = useState<any>();




  useEffect(() => {
    const loadTransactions = async (address: string) => {
      const transactions = await getTransactions(address, selectedAccount?.symbol);
      setWalletTransactions(transactions);
    };


    if (selectedAccount && selectedAccount?.id) {
      controller.accounts
        .getBalancesOfAccount(selectedAccount)
        .then(() => {
        });
      loadTransactions(selectedAccount?.id);
    }
  }, [selectedAccount?.id === address]);

  return (
    <div className={styles.page}>
      <Header
        className={styles.header}
        showAccountsDropdown
        showMenu
        type={'wallet'}
      />
      <img className={styles.networklogo} src={getSymbol(selectedAccount.symbol)?.icon} />
      <div className={styles.networktext}>{getSymbol(selectedAccount.symbol)?.name}</div>
      <div className={styles.primaryBalanceLabel}>
        {currentBalance?.loading ? (
          <SkeletonTheme color="#222" highlightColor="#000">
            <Skeleton width={150} />
          </SkeletonTheme>
        ) : (
          <div className={styles.primaryBalanceLabel}>{currentBalance &&
            `${currentBalance?.value / Math.pow(10, currentBalance?.currency?.decimals)} ${currentBalance?.currency?.symbol}`
          }</div>

        )}
      </div>
      <div className={styles.secondaryBalanceLabel}>
        {currentBalance?.loading ? (
          <SkeletonTheme color="#222" highlightColor="#000">
            <Skeleton width={100} />
          </SkeletonTheme>
        ) : (
          <span className={styles.secondaryBalanceLabel}>${((currentBalance?.value / Math.pow(10, currentBalance?.currency?.decimals)) * parseFloat(currentUSDValue?.usd))?.toFixed(3)}</span>
        )}
      </div>

      <CopyToClipboard text={selectedAccount?.id || ''}>
        <div className={styles.copyActionsView} onClick={_onCopy}>
          <div className={styles.copyCont}>
            <div className={styles.copyName}>{selectedAccount?.meta?.name}</div>
            <div className={styles.copyAddress}>
              {getShortAddress(selectedAccount?.id || '')}
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
          <Link className={styles.transactionsCont} to={"/account/receive/" + selectedAccount?.id}>
            <div className={styles.tokenActionButton}>
              <img className={styles.iconActions} src={icon_rec} />
              <div className={styles.tokenActionLabel}>Receive</div>
            </div>
          </Link>
        </div>

        <div className={clsx(styles.tokenActionView, styles.sendTokenAction)}>
          <Link className={styles.transactionsCont} to={"/account/send/" + selectedAccount?.id}>
            <div className={styles.tokenActionButton}>
              <img className={styles.iconActions} src={icon_send} />
              <div className={styles.tokenActionLabel}>Send</div>
            </div>
          </Link>
        </div>
      </div>

      <Link
        className={styles.resetLink}
        to={`/account/transactions/${selectedAccount?.id}`}
      >
        <div className={styles.assetsAndActivityDiv}>
          <div className={styles.tabsPill}></div>
          <div className={styles.tabsView}>
            <div
              className={clsx(
                styles.tabView,
                styles.selectedTabView
              )}
            >
              Transactions {walletTransactions?.total ? `(${walletTransactions?.total})` : ''}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default withRouter(Wallet);