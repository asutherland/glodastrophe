define(function(require) {
'use strict';

const ConversationListHeader =
  require('../components/pane_headers/conversation_list_header');

const { connect } = require('react-redux');

const { toggleSidebar } = require('../actions/sidebar');
const { navigateToDraft } = require('../actions/viewing');

const mapStateToProps = (state) => {
  return {
    mailApi: state.mailApi,
    view: state.viewing.live.conversationsView,
    viewTocMetaSerial: state.viewing.serials.viewTocMetaSerial
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onNavigateToDraft: (draftMessageId) => {
      dispatch(navigateToDraft(draftMessageId));
    },
    onToggleSidebar: () => {
      dispatch(toggleSidebar());
    },
  };
};

const SelectedConversationListHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversationListHeader);

return SelectedConversationListHeader;
});
