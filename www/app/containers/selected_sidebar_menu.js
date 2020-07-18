import SidebarMenu from '../components/pages/sidebar_menu';

import { connect } from 'react-redux';

import { selectAccountId, selectFolderId } from '../actions/viewing';

const mapStateToProps = (state) => {
  return {
    // sidebar control
    open: state.sidebar.open,
    // accounts list
    accountsView: state.mailApi.accounts,
    selectedAccountId: state.viewing.selections.accountId,
    // folders list
    accountFoldersView: state.viewing.live.account &&
                          state.viewing.live.account.folders,
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

const SelectedSidebarMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarMenu);

export default SelectedSidebarMenu;
