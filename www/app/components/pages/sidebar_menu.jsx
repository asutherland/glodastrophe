import React from 'react';
import PropTypes from 'prop-types';

import { Localized } from "@fluent/react";

import { Header, List, Segment, Sidebar } from 'semantic-ui-react';

import EntireList from '../entire_list';

import AccountListItem from '../list_items/account_list_item';
import FolderListItem from '../list_items/folder_list_item';


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
export default function SidebarMenu(props) {
  function onGoHome() {
    // per material-ui issues, it appears that we need to do manual handlers for
    // MenuItems but for *Button things we can use containerElement={<Link.../>}
    this.context.router.push('/');
  }

  return (
    <Siderbar.Pushable>
      <Sidebar
        >
        <Segment>
          <List>
            <List.Item
              icon='home'
              onClick={ this.goHome }
              >
              <Localized id='sidebar_home' />
            </List.Item>
          </List>
        </Segment>
        <Header as='h5' attached>
          <Localized id='sidebar_accounts_label' />
        </Header>
        <Segment>
          <EntireList
            view={ this.props.accountsView }
            selectedId={ this.props.selectedAccountId }
            pick={ this.props.onSelectAccountId }
            widget={ AccountListItem }
          />
        </Segment>
        <Header as='h5' attached>
          <Localized id='sidebar_folders_label' />
        </Header>
        <Segment>
          <EntireList
            view={ this.props.accountFoldersView }
            selectedId={ this.props.selectedFolderId }
            pick={ this.props.onSelectFolderId }
            widget={ FolderListItem }
          />
        </Segment>
      </Sidebar>
    </Siderbar.Pushable>
  );


};

SidebarMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  accountsView: PropTypes.object.isRequired,
  selectedAccountId: PropTypes.string,
  accountFoldersView: PropTypes.object,
  selectedFolderId: PropTypes.string,
  onSelectAccountId: PropTypes.func.isRequired,
  onSelectFolderId: PropTypes.func.isRequired
};


