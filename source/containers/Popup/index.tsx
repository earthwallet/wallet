/** Global Imports */
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';
import { BrowserRouter } from 'react-router-dom';

/** Local imprts */
import AppContainer from '~components/navigation/AppContainer';
import { STATE_PORT } from '~global/constant';

import AppRotuer from './router';

const store = new Store({ portName: STATE_PORT });

ReactDOM.render(
  <Provider store={store}>
    <AppContainer>
      <BrowserRouter>
        <AppRotuer />
      </BrowserRouter>
    </AppContainer>
  </Provider>,
  document.getElementById('popup-root')
);
