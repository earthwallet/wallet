
import React, { useEffect, useState } from 'react';
import styles from './index.scss';
import { Link } from 'react-router-dom';
import Header from '~components/Header';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import icon_rec from '~assets/images/icon_rec.svg';
import icon_send from '~assets/images/icon_send.svg';
import { getSymbol } from '~utils/common';
import clsx from 'clsx';
import { RouteComponentProps, withRouter } from 'react-router';
import { useSelector } from 'react-redux';
import { selectAccountById } from '~state/wallet';
import { getTransactions } from '@earthwallet/keyring';
import { useController } from '~hooks/useController';
import { selectBalanceById } from '~state/wallet';
import { selectAssetBySymbol, selectPriceByContractAddress } from '~state/assets';

import { useHistory } from 'react-router-dom';
import ICON_NOTICE from '~assets/images/icon_notice.svg';
import ICON_GRID from '~assets/images/icon_grid.svg';
import ICON_LIST from '~assets/images/icon_list.svg';
import Swiper from 'react-id-swiper';
import { getInfoBySymbol } from '~global/constant';
import ICON_FORWARD from '~assets/images/icon_forward.svg';
import { AssetsList, AssetsCoverflow } from '../NFTList';
import { selectGroupBalanceByGroupIdAndSymbol } from '~state/wallet';
import { selectActiveTokensByAddressWithInfo, selectActiveTokenAndAddressBalanceByAccountId, selectTokenByTokenPair } from '~state/tokens';
import AppsList from '~components/AppsList';
import useQuery from '~hooks/useQuery';
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

  const queryParams = useQuery();
  const navQuery: string = queryParams.get('nav') || '';


  const controller = useController();


  const selectedAccount = useSelector(selectAccountById(accountId));
  const { address } = selectedAccount;

  const history = useHistory();
  const [walletTransactions, setWalletTransactions] = useState<any>();
  const [nav, setNav] = useState('list');
  const [mainNav, setMainNav] = useState('tokens');
  const [selectedGridToken, setSelectedGridToken] = useState<string>('');

  useEffect(() => {
    if (!(selectedAccount?.symbol === 'ICP' || selectedAccount?.symbol === 'ETH' || selectedAccount?.symbol === 'MATIC')) {
      history.replace('/account/minidetails/' + address)
    }
    else {
      setSelectedGridToken(selectedAccount?.symbol)
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (accountId != null) {
      controller.tokens.getTokenBalances(accountId);
    }
  }, []);

  useEffect(() => {
    if (navQuery != '') {
      setMainNav(navQuery);
    }
  }, [navQuery != '']);


  useEffect(() => {
    const loadTransactions = async (address: string) => {
      if (selectedAccount?.symbol == 'ICP') {
        const transactions = await getTransactions(address, selectedAccount?.symbol);
        setWalletTransactions(transactions);
      } else if (selectedAccount?.symbol == 'BTC' || selectedAccount?.symbol == 'DOGE') {
        const transactions = await getTransactions_BTC_DOGE(address, selectedAccount?.symbol);
        setWalletTransactions(transactions);
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
      loadTransactions(selectedAccount?.address);
    }
  }, [address != null]);

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
      <div>
        <div className={styles.nav}>
          <div
            onClick={() => setMainNav('tokens')}
            className={clsx(styles.tabnav,
              mainNav === 'tokens' && styles.tabnav_active)}>
            {i18nT('tokenDetails.tokens')}
          </div>
          <div
            onClick={() => setMainNav('nfts')}
            className={clsx(styles.tabnav,
              mainNav === 'nfts' && styles.tabnav_active)}
          >
            {i18nT('tokenDetails.nfts')}
          </div>
          <div onClick={() => setMainNav('apps')}
            className={clsx(styles.tabnav,
              mainNav === 'apps' && styles.tabnav_active)}>
            {i18nT('tokenDetails.apps')}
          </div>
          <div className={styles.layoutnav}>
            <img
              onClick={() => setNav('grid')}
              className={
                clsx(
                  styles.layoutnavicon,
                  nav === 'grid' && styles.layoutnavicon_active
                )}
              src={ICON_GRID} />
            <img
              onClick={() => setNav('list')}
              className={
                clsx(
                  styles.layoutnavicon,
                  nav === 'list' && styles.layoutnavicon_active
                )} src={ICON_LIST} />
          </div>
        </div>

        <div className={styles.tabsep}></div>
      </div>
      {mainNav === 'apps' &&
        <>
          {nav === 'grid' && <AppsList address={address} hideAddress />}
          {nav === 'list' && <AppsList address={address} hideAddress />}
        </>
      }
      {mainNav === 'nfts' && <>
        {nav === 'grid' && <AssetsCoverflow accountId={accountId} />}
        {nav === 'list' && <div className={styles.nftslistcont}>
          <AssetsList accountId={accountId} />
        </div>}
      </>}

      {mainNav === 'tokens' && <>
        <div>
          {nav === 'grid' && <TokensGridflow
            accountId={accountId}
            setSelectedGridToken={setSelectedGridToken}
          />}
          {nav === 'list' && <TokensList accountId={accountId} />}
        </div>
        <div className={clsx(styles.tokenGrid, nav === 'list' && styles.tokenGridList)}>
          {(nav === 'grid') && <TokenOrSymbolBalance address={address} tokenId={selectedGridToken} />}
          {selectedAccount?.symbol !== 'ICP_Ed25519' && <div className={styles.walletActionsView}>
            <div
              className={clsx(styles.tokenActionView, styles.receiveTokenAction)}
            >
              <Link className={styles.transactionsCont} to={"/account/receive/" + selectedAccount?.id}>
                <div className={styles.tokenActionButton}>
                  <img className={styles.iconActions} src={icon_rec} />
                  <div className={styles.tokenActionLabel}>{i18nT('tokenDetails.rec')}</div>
                </div>
              </Link>
            </div>
            <div className={clsx(styles.tokenActionView, styles.sendTokenAction)}>
              <Link className={styles.transactionsCont} to={"/account/send/" + selectedAccount?.id}>
                <div className={styles.tokenActionButton}>
                  <img className={styles.iconActions} src={icon_send} />
                  <div className={styles.tokenActionLabel}>{i18nT('tokenDetails.send')}</div>
                </div>
              </Link>
            </div>
          </div>}
          {selectedAccount?.symbol === 'ICP_Ed25519' && <div className={styles.walletNoSupportActionsView}>
            <div className={styles.noSupportText}>
              <img src={ICON_NOTICE} className={styles.noticeIcon}></img>
              Ed25519 address is no longer supported. Please import seed from Export</div>
            <div
              className={clsx(styles.tokenActionView, styles.receiveTokenAction)}
            >
              <Link className={styles.transactionsCont} to={"/account/export/" + selectedAccount?.id}>
                <div className={styles.tokenActionButton}>
                  <img className={clsx(styles.iconActions, styles.exportIcon)} src={icon_send} />
                  <div className={styles.tokenActionLabel}>{i18nT('tokenDetails.export')}</div>
                </div>
              </Link>
            </div>
          </div>}
        </div>
      </>
      }
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
              {i18nT('wallet.txns')}{' '}{walletTransactions?.total ? `(${walletTransactions?.total})` : ''}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};


const TokensList = ({ accountId }: { accountId: string }) => {

  const history = useHistory();
  const selectedAccount = useSelector(selectAccountById(accountId));

  const { address, symbol } = selectedAccount;
  const tokens = useSelector(selectActiveTokensByAddressWithInfo(address, symbol));

  const activeTokenAndAddressBalance = useSelector(
    selectActiveTokenAndAddressBalanceByAccountId(accountId)
  );
  return (
    <div className={styles.tokensList}>
      <div className={styles.listHeader}>
        <div className={styles.listHeaderTitle}>{i18nT('tokenDetails.totalBalance')}</div>
        <div className={styles.listHeaderSubtitle}>${isNaN(activeTokenAndAddressBalance) ? 0 : activeTokenAndAddressBalance?.toFixed(2) || 0}</div>
      </div>
      <div className={styles.listitemscont}>
        <div
          onClick={() => history.push('/th/' + accountId + '/' + selectedAccount?.symbol)}
          className={styles.listitem}>
          <img
            className={styles.listicon}
            src={getInfoBySymbol(selectedAccount?.symbol)?.icon} >
          </img>
          <div className={styles.listinfo}>
            <div className={styles.listtitle}>{getInfoBySymbol(selectedAccount?.symbol)?.name}</div>
          </div>
          <GroupSymbolBalance groupId={selectedAccount?.groupId}
            symbol={getInfoBySymbol(selectedAccount?.symbol)?.symbol} />
          <img
            className={styles.listforward}
            src={ICON_FORWARD}
          />
        </div>
        {tokens?.length > 0 && tokens?.filter((token: keyable) => token?.symbol != null).map((token: keyable, i: number) => <div
          onClick={() => history.push('/th/' + accountId + '/' + token.id)}
          key={i}
          className={styles.listitem}>
          {token?.icon ? <img
            className={styles.listicon}
            src={token?.icon} >
          </img> : <div
            className={styles.listicon}
          >{token?.name?.charAt(0)}
          </div>}
          <div className={styles.listinfo}>
            <div className={styles.listtitle}>{token?.name}</div>
          </div>
          <div className={styles.liststats} >
            <div className={styles.listprice}>{token?.balanceTxt || 0} {token?.symbol}</div>
            {(selectedAccount.symbol == 'ETH' || selectedAccount.symbol == 'MATIC') ? <TokenPrice_ETH contractAddress={token?.contractAddress} balance={token?.balance} /> : <div className={styles.listsubtitle}>${token?.price || 0}   {
              token?.usd_24h_change && token?.price !== 0
              && <span className={token?.usd_24h_change > 0 ? styles.netstatspositive : styles.netstatsnegative}>{token?.usd_24h_change?.toFixed(2)}%</span>
            }</div>}
          </div>
          <img
            className={styles.listforward}
            src={ICON_FORWARD}
          />
        </div>)}
        {selectedAccount.symbol == "ICP" && <div
          onClick={() => history.push('/account/selecttoken/' + selectedAccount?.id)}
          className={styles.listitem}>
          <div
            className={styles.listicon} >
            <div>💎</div>
          </div>
          <div className={styles.listinfo}>
            <div className={styles.listtitle}>{i18nT('tokenDetails.select')}</div>
          </div>
          <div className={styles.liststats}></div>
          <img
            className={styles.listforward}
            src={ICON_FORWARD}
          />
        </div>}
      </div>
    </div>
  )
};

const GroupSymbolBalance = ({ groupId, symbol }: { groupId: string, symbol: string }) => {
  const currentAccount: keyable = useSelector(selectGroupBalanceByGroupIdAndSymbol(groupId, symbol));
  return <div
    className={styles.liststats}
  >
    <div><Balance account={currentAccount[0]} /></div>
    <div className={styles.listsubtitle}>
      <BalanceWithUSD id={currentAccount[0]?.id} />
    </div>
  </div>
}

const TokenPrice_ETH = ({ contractAddress, balance }: { contractAddress: string, balance: any }) => {
  const currentUSDValue: keyable = useSelector(selectPriceByContractAddress(contractAddress));
  if (currentUSDValue == undefined || currentUSDValue?.usd == undefined)
    return <></>;
  return <div className={styles.listsubtitle}>${(currentUSDValue?.usd * balance)?.toFixed(2) || 0}   {
    currentUSDValue?.usd_24h_change && (currentUSDValue?.usd * balance) !== 0
    && <span className={currentUSDValue?.usd_24h_change > 0 ? styles.netstatspositive : styles.netstatsnegative}>{currentUSDValue?.usd_24h_change?.toFixed(2)}%</span>
  }</div>
}

const TokenOrSymbolBalance = ({ address, tokenId }: { address: string, tokenId: string }) => {
  const currentBalance: keyable = useSelector(selectBalanceById(address));
  const currentUSDValue: keyable = useSelector(selectAssetBySymbol(getSymbol(tokenId)?.coinGeckoId || ''));
  const tokenPair = useSelector(selectTokenByTokenPair(address + "_WITH_" + tokenId));

  if (getInfoBySymbol(tokenId) != null) {
    return <div className={clsx(styles.balanceInfo)}>
      <div className={styles.primaryBalanceLabel}>
        {currentBalance?.loading ? (
          <SkeletonTheme color="#222" highlightColor="#000">
            <Skeleton width={150} />
          </SkeletonTheme>
        ) : (
          <div className={styles.primaryBalanceLabel}>{currentBalance &&
            `${(currentBalance?.value / Math.pow(10, currentBalance?.currency?.decimals) || 0).toFixed(4)} ${currentBalance?.currency?.symbol}`
          }</div>
        )}
      </div>
      <div className={styles.secondaryBalanceLabel}>
        {currentBalance?.loading ? (
          <SkeletonTheme color="#222" highlightColor="#000">
            <Skeleton width={100} />
          </SkeletonTheme>
        ) : (
          <span className={styles.secondaryBalanceLabel}>${((currentBalance?.value / Math.pow(10, currentBalance?.currency?.decimals)) * parseFloat(currentUSDValue?.usd))?.toFixed(2)}
            {
              currentBalance?.usd_24h_change && currentBalance?.value !== 0
              && <span className={currentBalance?.usd_24h_change > 0 ? styles.netstatspositive : styles.netstatsnegative}>{currentBalance?.usd_24h_change?.toFixed(2)}%</span>
            }
          </span>
        )}
      </div>
    </div>
  }

  return <div className={clsx(styles.balanceInfo)}>
    <div className={styles.primaryBalanceLabel}>
      <div className={styles.primaryBalanceLabel}>{tokenPair?.balanceTxt || 0} {tokenPair?.symbol}</div>
    </div>
    <div className={styles.secondaryBalanceLabel}>
      <span className={styles.secondaryBalanceLabel}>${tokenPair?.price || 0}</span>
      {
        tokenPair?.usd_24h_change && tokenPair?.price !== 0
        && <span className={tokenPair?.usd_24h_change > 0 ? styles.netstatspositive : styles.netstatsnegative}>{tokenPair?.usd_24h_change?.toFixed(2)}%</span>
      }
    </div>
  </div>
}



const TokensGridflow = ({ accountId, setSelectedGridToken }: { accountId: string, setSelectedGridToken: (token: string) => void }) => {
  const selectedAccount = useSelector(selectAccountById(accountId));
  const { address } = selectedAccount;
  const selectedSymbol = selectedAccount.symbol;
  const tokens = useSelector(selectActiveTokensByAddressWithInfo(address, selectedSymbol));
  const history = useHistory();
  const [swiper, setSwiper] = useState<any | null>(null);


  const updateCurrentIndex = (_index: number) => {
    if (_index == 0) {
      setSelectedGridToken(selectedSymbol)
    }
    else {
      setSelectedGridToken(tokens[_index - 1].id)
    }
  };

  useEffect(() => {
    if (swiper !== null) {
      swiper.on("slideChange", () => updateCurrentIndex(swiper.realIndex));
    }

    return () => {
      if (swiper !== null) {
        swiper.off("slideChange", () => updateCurrentIndex(swiper.realIndex));
      }
    };
  }, [swiper]);



  const params = {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    containerClass: "tokensswipercontainer",
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false
    },
    pagination: {
      el: '.swiper-pagination'
    }
  }
  if (tokens?.length > 0) {
    return <Swiper
      getSwiper={setSwiper}
      {...params}>
      <div
        onClick={() => history.push(`/th/${accountId}`)}
        className={styles.imagecont}>
        <img
          className={styles.imageIcon}
          src={getInfoBySymbol(selectedSymbol)?.icon} >
        </img>
      </div>
      {tokens?.length > 0 && tokens?.map((token: keyable, i: number) => <div
        onClick={() => history.push('/th/' + accountId + '/' + token.id)}
        key={i}
        className={styles.imagecont}>
        {token?.icon ? <img
          className={styles.imageIcon}
          src={token?.icon} >
        </img> : <div
          className={styles.imageIcon}
        >{token?.name?.charAt(0)}
        </div>}
      </div>)}
    </Swiper>
  }
  return (
    <Swiper
      getSwiper={setSwiper}
      {...params}>
      <div
        onClick={() => history.push(`/account/send/${address}`)}
        className={styles.imagecont}>
        <img
          className={styles.imageIcon}
          src={getInfoBySymbol(selectedSymbol)?.icon} >
        </img>
      </div>
    </Swiper>
  )
};


const Balance = ({ account }: { account: keyable }) => {
  const currentBalance: keyable = useSelector(selectBalanceById(account?.id));
  return <div className={styles.listprice}>{((currentBalance?.value || 0) / Math.pow(10, currentBalance?.currency?.decimals || 0)).toFixed(4)} {account?.symbol}</div>
}

const BalanceWithUSD = ({ id }: { id: string }) => {
  const currentBalance: keyable = useSelector(selectBalanceById(id));
  return <div className={styles.netlast}>
    <div className={styles.netstats}>${currentBalance?.balanceInUSD?.toFixed(2)}
      {
        currentBalance?.usd_24h_change && currentBalance?.balanceInUSD !== 0
        && <span className={currentBalance?.usd_24h_change > 0 ? styles.netstatspositive : styles.netstatsnegative}>{currentBalance?.usd_24h_change?.toFixed(2)}%</span>
      }
    </div>
  </div>
}

export default withRouter(Wallet);