import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { useTransition, animated } from 'react-spring';
import StarterPage from '~pages/popup/started/StarterPage';
import HomePage from '~pages/popup/signed/HomePage';

//import { ErrorBoundary, Loading } from '../components';

function wrapWithErrorBoundary(component: React.ReactElement, trigger?: string): React.ReactElement {
  // console.log('wrapWithErrorBoundary', trigger);
 // return <ErrorBoundary trigger={trigger}>{component}</ErrorBoundary>;
 console.log(trigger)
  return <div>{component}</div>;

}

const PopupRouter = () => {
  const location = useLocation();
  const transitions = useTransition(location, (locat) => locat.pathname, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 100 },
  });

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
          <Switch location={item}>
            <Route path="/popup.html" component={StarterPage} exact />
            <Route path="/auth-list" component={HomePage} exact />
            <Route path='/accounts'>{wrapWithErrorBoundary(<StarterPage />, 'accounts')}</Route>
            <Route path='/account/create'>{wrapWithErrorBoundary(<StarterPage />, 'account-creation')}</Route>
            <Route path='/account/export/:address'>{wrapWithErrorBoundary(<StarterPage />, 'export-address')}</Route>
            <Route path='/account/import-seed'>{wrapWithErrorBoundary(<StarterPage />, 'import-seed')}</Route>
            <Route path='/wallet/details'>{wrapWithErrorBoundary(<StarterPage />, 'wallet')}</Route>
            <Route path='/wallet/transactions/:address'>{wrapWithErrorBoundary(<StarterPage />, 'transactions')}</Route>
            <Route path='/wallet/transaction/:txnId'>{wrapWithErrorBoundary(<StarterPage />, 'transactions')}</Route>
            <Route path='/wallet/send'>{wrapWithErrorBoundary(<StarterPage />, 'wallet-send-token')}</Route>
            <Route path='/wallet/receive'>{wrapWithErrorBoundary(<StarterPage />, 'wallet-receive-token')}</Route>
          </Switch>
        </animated.div>
      ))}
    </>
  );
};

export default PopupRouter;
