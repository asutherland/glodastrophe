import ConversationListPane from
  '../components/panes/conversation_list';

import { connect } from 'react-redux';

import { selectConversationId } from '../actions/viewing';

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

export default SelectedConversationListPane;
