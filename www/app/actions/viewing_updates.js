define(function(require) {
'use strict';

/**
 * This file provides the actions used by the viewing-reducer's subscriptions to
 * generate actions so it can update the serial numbers that are required for
 * changes to their sibling views/objects to be perceived under a pure
 * functional model.
 *
 * A key hacky thing we do here is directly access the store so that we can
 * dispatch the actions.  We do this here with appropriately-named
 * self-dispatching actions because:
 * - Since the reducers do not have direct access to dispatch, it has to be
 *   done somewhere.  Arguably it's less ugly to do it here than in the reducer,
 *   but only just.
 * - The alternative of having the actions be in charge of these subscriptions
 *   and cleverly using thunk middleware does not seem like an improvement.
 *   Specifically, we could have the select*() family of actions create the
 *   view with a first dispatched action, then keep dispatching updates as they
 *   come in.  But, at least as I'm envisioning it, this seems to defeat the
 *   point of centralizing state.  Also, it gets weird with closing the views
 *   implicitly when a new thing is selected.
 **/

// For circular dependency/horrible hack reasons, start out without dispatch and
// grab it from our debugging global.
let dispatch = () => {};
setTimeout(() => {
  dispatch = window.REDUX_STORE.dispatch;
}, 0);


const { UPDATE_CONVERSATIONS_VIEW_SERIALS, UPDATE_CONVERSATION_SERIAL,
        UPDATE_MESSAGES_VIEW_SERIALS } = require('./actionTypes');

return {
  dispatchConversationsViewSerialUpdate: function(view) {
    dispatch({
      type: UPDATE_CONVERSATIONS_VIEW_SERIALS,
      view
    });
  },
  dispatchConversationSerialUpdate: function(conv) {
    dispatch({
      type: UPDATE_CONVERSATION_SERIAL,
      conv
    });
  },
  dispatchMessagesViewSerialUpdate: function(view) {
    dispatch({
      type: UPDATE_MESSAGES_VIEW_SERIALS,
      view
    });
  }
};
});
