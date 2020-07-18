import MessageListHeader from
  '../components/pane_headers/message_list_header';

import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    conversation: state.viewing.live.conversation,
    conversationSerial: state.viewing.serials.conversationSerial
  };
};

const SelectedMessageListHeader = connect(
  mapStateToProps,
  null
)(MessageListHeader);

export default SelectedMessageListHeader;
