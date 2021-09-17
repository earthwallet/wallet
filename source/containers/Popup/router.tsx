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
    controller.preloadState();
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
                <Redirect to="/accounts" />
              </Route>
              <Route path="/home">
                <Redirect to="/accounts" />
              </Route>
              <Route path="/accounts">
                {wrapWithErrorBoundary(<Accounts />, 'accounts')}
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
              <Route path="/account/details/:address">
                {wrapWithErrorBoundary(<Wallet />, 'wallet')}
              </Route>
              <Route path="/account/transactions/:address">
                {wrapWithErrorBoundary(<Transactions />, 'transactions')}
              </Route>
              <Route path="/account/transaction/:txnId">
                {wrapWithErrorBoundary(<TransactionDetails />, 'transactions')}
              </Route>
              <Route path="/account/send/:address">
                {wrapWithErrorBoundary(<WalletSendTokens />, 'wallet-send-token')}
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
              <Route path="/account/assets/nftlist/:address">
                {wrapWithErrorBoundary(<NFTList />, 'accounts')}
              </Route>
              <Route path="/nftdetails/:assetid">
                {wrapWithErrorBoundary(<NFTDetails />, 'accounts')}
              </Route>
              <Route path="/createnft/:address">
                {wrapWithErrorBoundary(<CreateNFT />, 'accounts')}
              </Route>

            </Switch>
          </ToastProvider>
        </animated.div>
      ))}
    </>
  );
};

export default PopupRouter;
