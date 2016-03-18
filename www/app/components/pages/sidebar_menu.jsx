define(function (require) {
'use strict';

const React = require('react');

const { injectIntl } = require('react-intl');

const FontIcon = require('material-ui/lib/font-icon');

const LeftNav = require('material-ui/lib/left-nav');
const List = require('material-ui/lib/lists/list');
const ListItem = require('material-ui/lib/lists/list-item');
const Divider = require('material-ui/lib/divider');

const EntireMaterialList = require('../entire_material_list');

const makeAccountListItem = require('../list_item_factories/account_list_item');
const makeFolderListItem = require('../list_item_factories/folder_list_item');


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
  propTypes: {
    open: React.PropTypes.bool.isRequired,
    accountsView: React.PropTypes.object.isRequired,
    selectedAccountId: React.PropTypes.string,
    accountFoldersView: React.PropTypes.object,
    selectedFolderId: React.PropTypes.string,
    onSelectAccountId: React.PropTypes.func.isRequired,
    onSelectFolderId: React.PropTypes.func.isRequired
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },

  render: function() {
    return (
      <LeftNav open={ this.props.open }>
        <List>
          <ListItem
            primaryText={ this.props.intl.formatMessage({ id: 'sidebar_home' }) }
            leftIcon={ <FontIcon className="material-icons">home</FontIcon> }
            onTouchTap={ this.goHome }
            />
        </List>
        <Divider />
        <EntireMaterialList
          subheader={ this.props.intl.formatMessage({ id: 'sidebar_accounts_label' }) }
          view={ this.props.accountsView }
          viewEvent={ 'complete' }
          selectedId={ this.props.selectedAccountId }
          pick={ this.props.onSelectAccountId }
          listItemFactory={ makeAccountListItem }
          />
        <Divider />
        <EntireMaterialList
          subheader={ this.props.intl.formatMessage({ id: 'sidebar_folders_label' }) }
          view={ this.props.accountFoldersView }
          viewEvent={ 'complete' }
          selectedId={ this.props.selectedFolderId }
          pick={ this.props.onSelectFolderId }
          listItemFactory={ makeFolderListItem }
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
