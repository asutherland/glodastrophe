define(function (require) {
'use strict';

const React = require('react');

const { injectIntl } = require('react-intl');

const LeftNav = require('material-ui/lib/left-nav');
const List = require('material-ui/lib/lists/list');
const ListItem = require('material-ui/lib/lists/list-item');
const Divider = require('material-ui/lib/divider');

const EntireMaterialList = require('../entire_material_list');

const AccountListItem = require('../list_items/account_list_item');
const FolderListItem = require('../list_items/folder_list_item');

/**
 * The "home" view currently shows a list of summaries of accounts.  I created
 * this primarily to be a place to put the "add an account" link without needing
 * a customized "hey, I see you have no accounts" thing.  But I also had the
 * noble goal to provide some info about the accounts that might be slightly
 * useful.  So now the goal is dashboard craziness.
 *
 * There is no intent to provide a useful UX here.  Ideally evolve this into
 * nothingness and evolve the summaries into something useful.
 */
var SidebarMenu = React.createClass({
  render: function() {
    return (
      <LeftNav open={ this.props.open }>
        // - Top level navigation: Home Button.
        <List>
          <ListItem
            primaryText={ this.props.intl.formatMessage({ id: 'sidebar_home' }) }
            leftIcon={ <FontIcon className="material-icons">home</FontIcon> }
            onTouchTap={ this.goHome }
            />
        </List>
        <Divider />
        // - Account List
        <EntireMaterialList
          subheader={ this.props.intl.formatMessage({ id: 'sidebar_accounts_label' }) }
          view={ this.props.accountsView }
          selectedId={ this.props.selectedAccountId }
          pick={ this.props.onSelectAccountId }
          widget={ AccountListItem }
          />
        <Divider />
        // - Selected Account's Folders
        <EntireMaterialList
          subheader={ this.props.intl.formatMessage({ id: 'sidebar_folders_label' }) }
          view={ this.props.accountFoldersView }
          selectedId={ this.props.selectedFolderId }
          pick={ this.props.onSelectFolderId }
          widget={ FolderListItem }
          />
      </LeftNav>
    );
  },

  goHome: function() {
    // per material-ui issues, it appears that we need to do manual handlers for
    // MenuItems but for *Button things we can use containerElement={<Link.../>}
    this.context.router.push('/');
  }
});

return injectIntl(SidebarMenu);
});
