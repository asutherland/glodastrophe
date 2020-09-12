import React from 'react';
import PropTypes from 'prop-types';

import { Localized } from '@fluent/react';

import { Header, List, Segment, Sidebar } from 'semantic-ui-react';

import EntireList from '../entire_list';

import AccountListItem from '../list_items/account_list_item';
import FolderListItem from '../list_items/folder_list_item';
import { useHistory } from 'react-router-dom';


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
  // XXX This was originally done in an alternate form for material-ui, perhaps
  // this could just use a Link now?
  const history = useHistory();
  function onGoHome() {
    history.push('/');
  }

  // XXX This had been converted from a material-ui sidebar-ish thing that
  // got converted to a semantic-ui sidebar, but that started having layout
  // problems when interacting with the react-split-pane.  I'm reverting this
  // to be its own always-present split-pane for sanity.
  return (
    <Segment.Group>
        <Segment>
          <List>
            <List.Item
              onClick={ onGoHome }
              >
              <List.Icon name='home' />
              <List.Content><Localized id='sidebar_home' /></List.Content>
            </List.Item>
          </List>
        </Segment>
        <Header as='h5' attached>
          <Localized id='sidebar_accounts_label' />
        </Header>
        <Segment>
          <EntireList
            as={ List }
            view={ props.accountsView }
            selectedId={ props.selectedAccountId }
            pick={ props.onSelectAccountId }
            widget={ AccountListItem }
          />
        </Segment>
        <Header as='h5' attached>
          <Localized id='sidebar_folders_label' />
        </Header>
        <Segment>
          <EntireList
            as={ List }
            view={ props.accountFoldersView }
            selectedId={ props.selectedFolderId }
            pick={ props.onSelectFolderId }
            widget={ FolderListItem }
          />
        </Segment>
    </Segment.Group>
  );
}

SidebarMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  accountsView: PropTypes.object.isRequired,
  selectedAccountId: PropTypes.string,
  accountFoldersView: PropTypes.object,
  selectedFolderId: PropTypes.string,
  onSelectAccountId: PropTypes.func.isRequired,
  onSelectFolderId: PropTypes.func.isRequired
};


