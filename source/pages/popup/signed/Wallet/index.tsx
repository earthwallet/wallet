import React, { useEffect, useState, useCallback } from 'react';
import styles from './index.scss';
import { Link } from 'react-router-dom';
import Header from '~components/Header';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import CopyToClipboard from 'react-copy-to-clipboard';
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
import { selectBalanceById } from '~state/wallet';
import { selectAssetBySymbol } from '~state/assets';
import useToast from '~hooks/useToast';

import { useHistory } from 'react-router-dom';
import ICON_NOTICE from '~assets/images/icon_notice.svg';
import { selectAssetsICPCountByAddress } from '~state/wallet';
import { ClipLoader } from 'react-spinners';
import { getTransactions_ETH_MATIC } from '~utils/services';
import { getTransactions_BTC_DOGE } from '~utils/btc';
import { i18nT } from '~i18n/index';

interface Props extends RouteComponentProps<{ accountId: string }> {
}
interface keyable {
  [key: string]: any
}

const Wallet = ({
  match: {
    params: { accountId },
  },
}: Props) => {

  const controller = useController();
  const { show } = useToast();

  const _onCopy = useCallback((): void => show('Copied'), [show]);
  const selectedAccount = useSelector(selectAccountById(accountId));
  const { address } = selectedAccount;

  const history = useHistory();


  const currentBalance: keyable = useSelector(selectBalanceById(address));
  const currentUSDValue: keyable = useSelector(selectAssetBySymbol(getSymbol(selectedAccount?.symbol)?.coinGeckoId || ''));

  const [walletTransactions, setWalletTransactions] = useState<any>();




  useEffect(() => {
    const loadTransactions = async (address: string) => {

      if (selectedAccount?.symbol == "ICP") {
        const transactions = await getTransactions(address, selectedAccount?.symbol);
        setWalletTransactions(transactions);
      } else if (selectedAccount?.symbol == "BTC" || (selectedAccount?.symbol == "DOGE")) {
        const response = await getTransactions_BTC_DOGE(address, selectedAccount?.symbol);
        const wallet = { txs: response, total: response?.length };
        setWalletTransactions(wallet);
      } else {
        const response = await getTransactions_ETH_MATIC(address, selectedAccount?.symbol);
        const wallet = { txs: response, total: response?.length };
        setWalletTransactions(wallet);
      }
    };

    if (selectedAccount && selectedAccount?.id) {
      controller.accounts
        .getBalancesOfAccount(selectedAccount)
        .then(() => {
        });
      loadTransactions(selectedAccount?.id);
    }
  }, [selectedAccount?.id === address, selectedAccount?.symbol]);

  return (
    <div className={styles.page}>
      <Header
        className={styles.header}
        showAccountsDropdown={selectedAccount?.symbol !== 'ICP_Ed25519'}
        showMenu
        type={'wallet'}
        selectedAccount={selectedAccount}
        backOverride={() => history.push('/home')}
      />
      {selectedAccount?.id &&
        <AssetsICPCount icpAddress={selectedAccount?.id} />}

      <img className={styles.networklogo} src={getSymbol(selectedAccount?.symbol)?.icon} />
      <div className={styles.networktext}>{getSymbol(selectedAccount?.symbol)?.name}</div>
      <div className={styles.primaryBalanceLabel}>
        {currentBalance?.loading ? (
          <SkeletonTheme color="#222" highlightColor="#000">
            <Skeleton width={150} />
          </SkeletonTheme>
        ) : (
          <div className={styles.primaryBalanceLabel}>{currentBalance &&
            `${(currentBalance?.value / Math.pow(10, currentBalance?.currency?.decimals)).toFixed(6)} ${currentBalance?.currency?.symbol}`
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
              {getShortAddress(selectedAccount?.address || '')}
            </div>
          </div>
          <div className={styles.copyButton}>
            <img className={styles.iconCopy} src={icon_copy} />
          </div>
        </div>
      </CopyToClipboard>

      {selectedAccount?.symbol !== 'ICP_Ed25519' && <div className={styles.walletActionsView}>
        <div
          className={clsx(styles.tokenActionView, styles.receiveTokenAction)}
        >
          <Link className={styles.transactionsCont} to={"/account/receive/" + selectedAccount?.id}>
            <div className={styles.tokenActionButton}>
              <img className={styles.iconActions} src={icon_rec} />
              <div className={styles.tokenActionLabel}>{i18nT('wallet.receive')}</div>
            </div>
          </Link>
        </div>

        <div className={clsx(styles.tokenActionView, styles.sendTokenAction)}>
          <Link className={styles.transactionsCont} to={"/account/send/" + selectedAccount?.id}>
            <div className={styles.tokenActionButton}>
              <img className={styles.iconActions} src={icon_send} />
              <div className={styles.tokenActionLabel}>{i18nT('wallet.send')}</div>
            </div>
          </Link>
        </div>
      </div>}

      {selectedAccount?.symbol === 'ICP_Ed25519' && <div className={styles.walletNoSupportActionsView}>
        <div className={styles.noSupportText}>
          <img src={ICON_NOTICE} className={styles.noticeIcon}></img>
          {i18nT('wallet.noEd')}</div>
        <div
          className={clsx(styles.tokenActionView, styles.receiveTokenAction)}
        >
          <Link className={styles.transactionsCont} to={"/account/export/" + selectedAccount?.id}>
            <div className={styles.tokenActionButton}>
              <img className={clsx(styles.iconActions, styles.exportIcon)} src={icon_send} />
              <div className={styles.tokenActionLabel}>{i18nT('wallet.export')}</div>
            </div>
          </Link>
        </div>

      </div>}

      <Link
        className={clsx(styles.resetLink, styles.fixedBottom)}
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
              {i18nT('wallet.txns')}{" "}{walletTransactions?.total ? `(${walletTransactions?.total})` : ''}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
const AssetsICPCount = ({ icpAddress }: { icpAddress: string }) => {
  const assetsObj: keyable = useSelector(selectAssetsICPCountByAddress(icpAddress));
  const history = useHistory();


  if (assetsObj?.count === 0 || assetsObj?.count === undefined) return <></>;

  return <div
    onClick={() => history.push('/account/assets/nftlist/' + icpAddress)}
    className={styles.assetsCont}><div className={styles.assetCount}>{assetsObj?.count === 0 ? '' : assetsObj?.count === 1 ? 'See Your 1 NFT' : `See Your ${assetsObj?.count} NFTs`}
      {assetsObj.loading && <span className={styles.assetCountLoading}><ClipLoader color={'#fffff'}
        size={12} />
      </span>}
    </div></div>
}

export default withRouter(Wallet);