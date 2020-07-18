import React from 'react';

import EntireList from '../entire_list';

import AccountMenuItem from '../list_items/account_menu_item';

/**
 * List of currently known accounts for display in the sidebar.  Not used
 * directly; the `SelectedAccountListMenu` container is used instead.  This
 * could quite possibly be folded into that module, but I'm still learning.
 */
export default class AccountsListMenu extends React.Component {
  render() {
    return (
      <EntireList
        view={ this.props.accounts }
        selectedId={ this.props.selectedId }
        widget={ AccountMenuItem }
        pick={ this.props.pick }
        />
    );
  }
};