import React from 'react';
import { Switch, Route, useLocation, Redirect } from 'react-router-dom';
import { useTransition, animated } from 'react-spring';

import ErrorBoundary from '~components/ErrorBoundary';
import ConnectDappPage from '~pages/dapp/ConnectDappPage';

function wrapWithErrorBoundary(
  component: React.ReactElement,
  trigger?: string
): React.ReactElement {
  return <ErrorBoundary trigger={trigger}>{component}</ErrorBoundary>;
}

const DappRouter = () => {
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
            <Route path="/dapp.html">
              {wrapWithErrorBoundary(<ConnectDappPage />, 'connect')}
              {/* <Redirect to="/connect" /> */}
            </Route>
            <Route path="/connect">
              {/* {wrapWithErrorBoundary(<ConnectDappPage />, 'connect')} */}
            </Route>
          </Switch>
        </animated.div>
      ))}
    </>
  );
};

export default DappRouter;
