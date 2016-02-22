define(function(require) {
'use strict';

const { TOGGLE_SIDEBAR } = require('../actions/actionTypes');

return {
  toggleSidebar: function() {
    return {
      type: TOGGLE_SIDEBAR
    };
  }
};
});
