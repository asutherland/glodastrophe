define(function(require) {
'use strict';

const { combineReducers } = require('redux');

const mailApi = require('gelam/main-frame-setup');

return combineReducers({
  // The mailApi never changes; we're just putting it in here since it seems
  // more idiomatic to do this than not.
  mailApi: function() {
    return mailApi;
  },
  sidebar: require('./sidebar'),
  viewing: require('./viewing')
});
});
