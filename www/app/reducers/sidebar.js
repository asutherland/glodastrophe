define(function(require) {
'use strict';

const { TOGGLE_SIDEBAR } = require('../actions/actionTypes');

const DEFAULT_STATE = {
  open: false
};

return function reduceSidebar(oldState = DEFAULT_STATE, action) {
  switch (action.type) {
    case TOGGLE_SIDEBAR: {
      return {
        open: !oldState.open
      };
    }
    default: {
      return oldState;
    }
  }
};
});
