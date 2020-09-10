import { combineReducers } from 'redux';

import mailApi from 'gelam/main-frame-setup';

import SidebarReducers from './sidebar';
import ViewingReducers from './viewing';

export default combineReducers({
  // The mailApi never changes; we're just putting it in here since it seems
  // more idiomatic to do this than not.
  mailApi: function() {
    return mailApi;
  },
  sidebar: SidebarReducers,
  viewing: ViewingReducers,
});

