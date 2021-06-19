import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import './helpers/interceptor';
import store from './helpers/store';
import history from './helpers/history';

import FullLayout from './components/core/FullLayout';
import '../assets/fonts/rubik/rubik-regular.ttf';
import '../assets/fonts/rubik/rubik-regular.woff';
import '../assets/fonts/rubik/rubik-regular.woff2';
import '../theme/style.less';

render(
  <Provider store={store}>
    <Router history={history}>
      <FullLayout />
    </Router>
  </Provider>,
  document.getElementById('app'),
);
