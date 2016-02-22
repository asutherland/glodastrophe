define(function(require) {
'use strict';

const { combineReducers } = require('redux');

return combineReducers({
  sidebar: require('./sidebar'),
  viewing: require('./viewing')
});
});
