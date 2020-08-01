import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

const rootReducer = require('./reducers/index');

const store = window.REDUX_STORE = createStore(
  rootReducer,
  applyMiddleware(ReduxThunk)
);

export default store;
