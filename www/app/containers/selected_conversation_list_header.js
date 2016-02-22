define(function(require) {
'use strict';

const ConversationListHeader =
  require('../components/pane_headers/conversation_list_header');

const { connect } = require('react-redux');

const { toggleSidebar } = require('../actions/sidebar');
const { selectAccountId, selectFolderId } = require('../actions/viewing');

const mapStateToProps = (state) => {
  return {
    // sidebar control
    open: state.sidebar.open,
    // accounts list
    accountsView: state.mailApi.accounts,
    selectedAccountId: state.viewing.selections.accountId,
    // folders list
    accountFoldersView: state.viewing.live.account.folders,
    selectedFolderId: state.viewing.selections.folderId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelectAccountId: (accountId) => {
      dispatch(selectAccountId(accountId));
    },
    onSelectFolderId: (folderId) => {
      dispatch(selectFolderId(folderId));
    }
  };
};

const SelectedConversationListHeader= connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversationListHeader);

return SelectedConversationListHeader;
});
