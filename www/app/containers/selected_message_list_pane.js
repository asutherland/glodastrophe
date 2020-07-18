import MessageListPane from
  '../components/panes/message_list';

import { connect } from 'react-redux';

import { navigateToDraft, selectMessageId } from '../actions/viewing';

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

export default SelectedMessageListPane;
