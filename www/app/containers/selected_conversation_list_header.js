import ConversationListHeader from
  '../components/pane_headers/conversation_list_header';

import { connect } from 'react-redux';

import { toggleSidebar } from '../actions/sidebar';
import { navigateToDraft, addVisualization } from '../actions/viewing';

const mapStateToProps = (state) => {
  return {
    // XXX serial should be reflected through too based on usage.
    conversationSidebarDefsView:
      state.viewing.visualizationDefs.conversationSidebarDefsView,
    mailApi: state.mailApi,
    view: state.viewing.live.conversationsView,
    viewTocMetaSerial: state.viewing.serials.viewTocMetaSerial,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddSidebarVis: (visDef) => {
      dispatch(addVisualization('sidebar', visDef));
    },
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

export default SelectedConversationListHeader;