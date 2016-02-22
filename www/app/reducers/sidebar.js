define(function(require) {
'use strict';

const { TOGGLE_SIDEBAR } = require('../actions/actionTypes');

return function reduceSidebar(oldState, action) {
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
