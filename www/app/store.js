define(function(require) {
'use strict';

const { createStore, applyMiddleware } = require('redux');
const thunk = require('redux-thunk');

const rootReducer = require('./reducers/index');

const store = window.REDUX_STORE = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

return store;
});
