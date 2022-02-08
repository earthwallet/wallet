import React, { useEffect } from 'react';
import { Switch, Route, useLocation, Redirect } from 'react-router-dom';
import { useTransition, animated } from 'react-spring';
import Accounts from '~pages/popup/signed/Accounts';
import CreateAccount from '~pages/popup/signed/CreateAccount';
import TransactionDetails from '~pages/popup/signed/TransactionDetails';
import Export from '~pages/popup/signed/Export';
import ImportSeed from '~pages/popup/signed/ImportSeed';
import Transactions from '~pages/popup/signed/Transactions';
import Wallet from '~pages/popup/signed/Wallet';
import WalletSendTokens from '~pages/popup/signed/WalletSendTokens';
import WalletReceiveTokens from '~pages/popup/signed/WalletReceiveTokens';
import Portfolio from '~pages/popup/signed/Portfolio';
import ErrorBoundary from '~components/ErrorBoundary';
import { useController } from '~hooks/useController';
import NFTDetails from '~pages/popup/signed/NFTDetails';
import CreateNFT from '~pages/popup/signed/CreateNFT';
import AddNetwork from '~pages/popup/signed/AddNetwork';
import ToastProvider from '~components/ToastProvider';
import NFTList from '~pages/popup/signed/NFTList';
import ListNFT from '~pages/popup/signed/ListNFT';
import WalletSettings from '~pages/popup/signed/WalletSettings';
import DappDetails from '~pages/popup/signed/DappDetails';
import TokenDetails from '~pages/popup/signed/TokenDetails';
import TokenHistory from '~pages/popup/signed/TokenHistory';
import Stake from '~pages/popup/signed/Stake';
import Swap from '~pages/popup/signed/Swap';
import SelectTokens from '~pages/popup/signed/SelectTokens';
import TransactionLoading from '~pages/popup/signed/TransactionLoading';
import SubmittingTransactions from '~pages/popup/signed/SubmittingTransactions';
import Settings from '~pages/popup/signed/Settings';
import SwapTransactions from '~pages/popup/signed/SwapTransactions';
import Marketplace from '~pages/popup/signed/Marketplace';
import Marketplace1 from '~pages/popup/signed/Marketplace1';
import NFTMarketplace from '~pages/popup/signed/NFTMarketplace';
import NFTCollection from '~pages/popup/signed/NFTCollection';
import NFTBuyDetails from '~pages/popup/signed/NFTBuyDetails';
import NFTSettle from '~pages/popup/signed/NFTSettle';

function wrapWithErrorBoundary(
  component: React.ReactElement,
  trigger?: string
): React.ReactElement {
  return <ErrorBoundary trigger={trigger}>{component}</ErrorBoundary>;
}

const PopupRouter = () => {
  const location = useLocation();
  const controller = useController();
  const transitions = useTransition(location, (locat) => locat.pathname, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 100 },
  });

  useEffect(() => {
    controller.preloadState().then(() => {
      try {
        controller.migrateLocalStorage();
      } catch (error) {
        console.log(error);
      }
    });
  }, []);

  return (
    <>
      {transitions.map(({ item, props, key }) => (
        <animated.div
          style={{
            ...props,
            position: 'absolute',
            height: '100%',
            width: '100%',
          }}
          key={key}
        >
          <ToastProvider>
            <Switch location={item}>
              <Route path="/popup.html">
                <Redirect to="/nft/settle/jta7g-wqkor-uwiaa-aaaaa-cmaaq-qaqca-aadet-a?price=12000000" />
              </Route>
              <Route path="/home">
                <Redirect to="/accounts" />
              </Route>

              <Route path="/accounts">
                {wrapWithErrorBoundary(<Accounts />, 'accounts')}
              </Route>
              <Route path="/task1">
                {wrapWithErrorBoundary(<TransactionLoading />, 'accounts')}
              </Route>
              <Route path="/task2">
                {wrapWithErrorBoundary(<SubmittingTransactions />, 'accounts')}
              </Route>
              <Route path="/task3">
                {wrapWithErrorBoundary(<Settings />, 'accounts')}
              </Route>
              <Route path="/task4">
                {wrapWithErrorBoundary(<SwapTransactions />, 'accounts')}
              </Route>
              <Route path="/task5">
                {wrapWithErrorBoundary(<Marketplace />, 'accounts')}
              </Route>
              <Route path="/task6">
                {wrapWithErrorBoundary(<Marketplace1 />, 'accounts')}
              </Route>
              <Route path="/account/marketplace/:address">
                {wrapWithErrorBoundary(<NFTMarketplace />, 'NFTMarketplace')}
              </Route>
              <Route path="/nft/collection/:nftId">
                {wrapWithErrorBoundary(<NFTCollection />, 'NFTCollection')}
              </Route>
              <Route path="/nft/buy/:nftId">
                {wrapWithErrorBoundary(<NFTBuyDetails />, 'NFTBuyDetails')}
              </Route>
              <Route path="/nft/settle/:nftId">
                {wrapWithErrorBoundary(<NFTSettle />, 'accounts')}
              </Route>
              <Route path="/portfolio">
                {wrapWithErrorBoundary(<Portfolio />, 'portfolio')}
              </Route>
              <Route path="/account/create">
                {wrapWithErrorBoundary(<CreateAccount />, 'account-creation')}
              </Route>
              <Route path="/account/export/:address">
                {wrapWithErrorBoundary(<Export />, 'export-address')}
              </Route>
              <Route path="/account/import">
                {wrapWithErrorBoundary(<ImportSeed />, 'import-seed')}
              </Route>
              <Route path="/account/minidetails/:address">
                {wrapWithErrorBoundary(<Wallet />, 'wallet')}
              </Route>
              <Route path="/account/transactions/:address">
                {wrapWithErrorBoundary(<Transactions />, 'transactions')}
              </Route>
              <Route path="/account/transaction/:txnId">
                {wrapWithErrorBoundary(<TransactionDetails />, 'transactions')}
              </Route>
              <Route path="/account/send/:address">
                {wrapWithErrorBoundary(
                  <WalletSendTokens />,
                  'wallet-send-token'
                )}
              </Route>
              <Route path="/account/receive/:address">
                {wrapWithErrorBoundary(
                  <WalletReceiveTokens />,
                  'wallet-receive-token'
                )}
              </Route>
              <Route path="/account/addnetwork/:groupId">
                {wrapWithErrorBoundary(<AddNetwork />, 'accounts')}
              </Route>
              <Route path="/account/selecttoken/:address">
                {wrapWithErrorBoundary(<SelectTokens />, 'selecttokens')}
              </Route>
              <Route path="/account/assets/nftlist/:address">
                {wrapWithErrorBoundary(<NFTList />, 'accounts')}
              </Route>
              <Route path="/account/listnft/:address">
                {wrapWithErrorBoundary(<ListNFT />, 'accounts')}
              </Route>
              <Route path="/nftdetails/:assetid">
                {wrapWithErrorBoundary(<NFTDetails />, 'accounts')}
              </Route>
              <Route path="/createnft/:address">
                {wrapWithErrorBoundary(<CreateNFT />, 'accounts')}
              </Route>
              <Route path="/walletsettings">
                {wrapWithErrorBoundary(<WalletSettings />, 'walletsettings')}
              </Route>
              <Route path="/dappdetails/:origin">
                {wrapWithErrorBoundary(<DappDetails />, 'dappdetails')}
              </Route>
              <Route path="/stake/:address/:tokenId">
                {wrapWithErrorBoundary(<Stake />, 'Stake')}
              </Route>
              <Route path="/swap/:address/:tokenId">
                {wrapWithErrorBoundary(<Swap />, 'Swap')}
              </Route>
              <Route path="/th/:address/:tokenId">
                {wrapWithErrorBoundary(<TokenHistory />, 'TokenHistory')}
              </Route>
              <Route path="/account/details/:address">
                {wrapWithErrorBoundary(<TokenDetails />, 'TokenDetails')}
              </Route>
            </Switch>
          </ToastProvider>
        </animated.div>
      ))}
    </>
  );
};

export default PopupRouter;
