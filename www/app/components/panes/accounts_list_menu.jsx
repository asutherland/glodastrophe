define(function (require) {
'use strict';

const React = require('react');

const EntireList = require('../entire_list');

const AccountMenuItem = require('../list_items/account_menu_item');

/**
 * List of currently known accounts for display in the sidebar.  Not used
 * directly; the `SelectedAccountListMenu` container is used instead.  This
 * could quite possibly be folded into that module, but I'm still learning.
 */
var AccountsListMenu = React.createClass({
  render: function() {
    return (
      <EntireList
        view={ this.props.accounts }
        selectedId={ this.props.selectedId }
        widget={ AccountMenuItem }
        pick={ this.props.pick }
        />
    );
  },
});

return AccountsListMenu;
});
