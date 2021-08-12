/** Global Imports */
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';
import { BrowserRouter } from 'react-router-dom';

/** Local imports */
import AppContainer from '~components/navigation/AppContainer';
import { STATE_PORT } from '~global/constant';

import DAppRouter from './router';

const store = new Store({ portName: STATE_PORT });

store.ready().then(() => {
  // The store implements the same interface as Redux's store
  // so you can use tools like `react-redux` no problem!
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <BrowserRouter>
          <DAppRouter />
        </BrowserRouter>
      </AppContainer>
    </Provider>,
    document.getElementById('dapp-root')
  );
});
