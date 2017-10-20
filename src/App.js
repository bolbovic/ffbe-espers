import React from 'react';
import { Provider } from 'mobx-react';

import createHistory from './helpers/History';
import Routes from './routes/Routes';
import stores from './stores';

import '../node_modules/@blueprintjs/core/dist/blueprint.css';
import '../node_modules/normalize.css/normalize.css';
import './App.css';

const history = createHistory(stores.uiSt);

export default () => (
  <Provider {...stores}>
    <div>
      <Routes history={history} />
    </div>
  </Provider>
);
