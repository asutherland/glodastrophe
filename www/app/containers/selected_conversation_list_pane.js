define(function(require) {
'use strict';

const ConversationListPane =
  require('../components/panes/conversation_list');

const { connect } = require('react-redux');

const { selectConversationId } = require('../actions/viewing');

const mapStateToProps = (state) => {
  return {
    selectedConversationId: state.viewing.selections.conversationId,
    view: state.viewing.live.conversationsView
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelectConversationId: (conversationId) => {
      dispatch(selectConversationId(conversationId));
    },
  };
};

const SelectedConversationListPane = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversationListPane);

return SelectedConversationListPane;
});
