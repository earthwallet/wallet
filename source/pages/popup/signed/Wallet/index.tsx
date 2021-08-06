import React, { useEffect, useState } from 'react';
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
import { RouteComponentProps, withRouter } from 'react-router';
import { useSelector } from 'react-redux';
import { selectActiveAccount, selectAccountById } from '~state/wallet';
import { getBalance, getTransactions } from '@earthwallet/sdk';

interface Props extends RouteComponentProps<{ address?: string }> {
  className?: string;
}
interface keyable {
  [key: string]: any
}

const Wallet = ({
  match: {
    params: { address = '' },
  },
}: Props) => {


  //const _onCopy = useCallback((): void => show('Copied'), [show]);
  const _onCopy = console.log;

  const selectedAccountFromRouter = useSelector(selectAccountById(address));
  const selectedAccountFromRedux = useSelector(selectActiveAccount);

  const selectedAccount = address === '' ? selectedAccountFromRedux : selectedAccountFromRouter;
  const [loading, setLoading] = useState<boolean>(false);
  const [usdValue, setUsdValue] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<any | null>(null);

  const [walletTransactions, setWalletTransactions] = useState<any>();

  const getBalanceInUSD = async (walletBalance: keyable) => {
    const balance = walletBalance?.balances[0]?.value;
    const decimals = walletBalance?.balances[0]?.currency?.decimals;

    const fetchHeaders = new Headers();

    fetchHeaders.append('accept', 'application/json');

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: fetchHeaders,
      redirect: 'follow'
    };

    const factor: keyable = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd', requestOptions)
      .then((response) => response.json())
      .catch((error) => console.log('error', error));

    setUsdValue((balance / Math.pow(10, decimals)) * parseFloat(factor['internet-computer'].usd));
  };

  const loadTransactions = async (address: string) => {
    const transactions = await getTransactions(address, 'ICP');

    setWalletTransactions(transactions);
  };

  useEffect(() => {
    const loadBalance = async (address: string) => {
      setLoading(true);
      const balance: keyable = await getBalance(address, 'ICP');

      setLoading(false);

      if (balance && balance?.balances != null) {
        setWalletBalance(balance);
        getBalanceInUSD(balance);
      }
    };

    if (selectedAccount && selectedAccount?.address) {
      loadBalance(selectedAccount?.address);
      loadTransactions(selectedAccount?.address);
    }
  }, [selectedAccount]);

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
          <div className={styles.primaryBalanceLabel}>{walletBalance && walletBalance?.balances[0] &&
            `${walletBalance?.balances[0]?.value / Math.pow(10, walletBalance?.balances[0]?.currency?.decimals)} ${walletBalance?.balances[0]?.currency?.symbol}`
          }</div>
        )}
      </div>
      <div className={styles.secondaryBalanceLabel}>
        {loading ? (
          <SkeletonTheme color="#222" highlightColor="#000">
            <Skeleton width={100} />
          </SkeletonTheme>
        ) : (
          <span className={styles.secondaryBalanceLabel}>${usdValue.toFixed(3)}</span>
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
          <Link className={styles.transactionsCont} to={"/account/receive/" + selectedAccount.id}>
            <div className={styles.tokenActionButton}>
              <img className={styles.iconActions} src={icon_rec} />
              <div className={styles.tokenActionLabel}>Receive</div>
            </div>
          </Link>
        </div>

        <div className={clsx(styles.tokenActionView, styles.sendTokenAction)}>
          <Link className={styles.transactionsCont} to={"/account/send/" + selectedAccount.id}>
            <div className={styles.tokenActionButton}>
              <img className={styles.iconActions} src={icon_send} />
              <div className={styles.tokenActionLabel}>Send</div>
            </div>
          </Link>
        </div>
      </div>

      <Link
        className={styles.resetLink}
        to={`/account/transactions/d3e13d4777e22367532053190b6c6ccf57444a61337e996242b1abfb52cf92c8`}
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
              Transactions {walletTransactions?.transactions?.length === 0 || walletTransactions?.transactions === undefined ? '' : `(${walletTransactions?.transactions?.length})`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default withRouter(Wallet);
