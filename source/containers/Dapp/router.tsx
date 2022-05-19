import React from 'react';
import { Switch, Route, useLocation, Redirect } from 'react-router-dom';
import { useTransition, animated } from 'react-spring';
import ErrorBoundary from '~components/ErrorBoundary';
import ConnectDappPage from '~pages/dapp/ConnectDappPage';
import SignTransactionPage from '~pages/dapp/SignTransactionPage';
import queryString from 'query-string';
import ToastProvider from '~components/ToastProvider';
import UnsignedApprovePage from '~pages/dapp/UnsignedApprovePage';

function wrapWithErrorBoundary(
  component: React.ReactElement,
  trigger?: string
): React.ReactElement {
  return <ErrorBoundary trigger={trigger}>{component}</ErrorBoundary>;
}

const DappRouter = () => {
  const location = useLocation();
  const { route } = queryString.parse(location.search);

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
          <ToastProvider>
            <Switch location={item}>
              <Route path="/dapp.html">
                {route
                  ? <Redirect to={`/${route}${location.search}${location.hash}`} />
                  : <Redirect to={`/connect${location.search}${location.hash}`} />}
              </Route>
              <Route path="/connect">
                {wrapWithErrorBoundary(<ConnectDappPage />, 'connect')}
              </Route>
              <Route path="/sign">
                {wrapWithErrorBoundary(<SignTransactionPage />, 'sign')}
              </Route>
              <Route path="/approve">
                {wrapWithErrorBoundary(<UnsignedApprovePage />, 'approve')}
              </Route>
            </Switch>
          </ToastProvider>
        </animated.div>
      ))}
    </>
  );
};

export default DappRouter;
