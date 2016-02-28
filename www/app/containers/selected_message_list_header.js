define(function(require) {
'use strict';

const MessageListHeader =
  require('../components/pane_headers/message_list_header');

const { connect } = require('react-redux');

const mapStateToProps = (state) => {
  return {
    conversation: state.viewing.live.conversation,
    view: state.viewing.live.messagesView
  };
};

const SelectedMessageListHeader = connect(
  mapStateToProps,
  null
)(MessageListHeader);

return SelectedMessageListHeader;
});
