import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import { registerSagasWithMiddleware } from '../sagas/';
import apiActionMiddleware from './apiActionMiddleware';
import reduxRouterMiddleware from './reduxRouterMiddleware';

import reducers from '../reducers';

const middlewares = [apiActionMiddleware, reduxRouterMiddleware];
let composeEnhancers = compose;

if (process.env.NODE_ENV !== 'production') {
  composeEnhancers = composeWithDevTools;
  middlewares.push(createLogger());
}

const sagaMiddleware = createSagaMiddleware();
middlewares.push(sagaMiddleware);

// middlewares.push(apiActionMiddleware);


const enhancers = composeEnhancers(applyMiddleware(...middlewares));
const store = createStore(reducers, enhancers);

registerSagasWithMiddleware(sagaMiddleware);
export default store;
