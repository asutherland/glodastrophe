define(function(require) {
'use strict';

const MessageListPane =
  require('../components/panes/message_list');

const { connect } = require('react-redux');

const { navigateToDraft, selectMessageId } = require('../actions/viewing');

const mapStateToProps = (state) => {
  return {
    selectedMessageId: state.viewing.selections.messageId,
    view: state.viewing.live.messagesView
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onNavigateToDraft: (draftMessageId) => {
      dispatch(navigateToDraft(draftMessageId));
    },
    onSelectMessageId: (messageId) => {
      dispatch(selectMessageId(messageId));
    },
  };
};

const SelectedMessageListPane = connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageListPane);

return SelectedMessageListPane;
});
