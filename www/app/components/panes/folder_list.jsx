import React from 'react';

import { Localized } from "@fluent/react";

import EntireList from '../entire_list';

import FolderSummary from '../summaries/folder';

export default class FolderListPane extends React.PureComponent {
  getInitialState() {
    return {
      error: null,
      account: null,
    };
  }

  _getAccount(accountId) {
    if (!accountId) {
      this.setState({
        error: null,
        account: null
      });
    }

    this.props.mailApi.eventuallyGetAccountById(accountId).then(
      function gotAccount(account) {
        this.setState({
          account: account
        });
      }.bind(this),
      function noSuchAccount() {
        this.setState({
          error: true
        });
      }.bind(this)
    );
  }

  componentWillMount() {
    this._getAccount(this.props.accountId);
  }

  componentWillReceiveProps(nextProps) {
    this._getAccount(nextProps.accountId);
  }

  componentWillUnmount() {
    // We don't want to release the folders view; it's not owned by us.
  }

  render() {
    if (!this.props.accountId) {
      return <div></div>;
    }

    if (this.state.error) {
      return <div>No SucH AccounT</div>;
    }

    if (!this.state.account) {
      return <div>LoadinG AccounT...</div>;
    }

    return (
      <div className="folder-pane">
        <EntireList
          view={ this.state.account.folders }
          widget={ FolderSummary }
          selectedId={ this.props.selectedId }
          pick={ this.props.pick }
          />
        <button onClick={ this.syncFolderList }>
          <Localized
            id='refreshFolderList'
            />
        </button>
      </div>
    );
  }

  syncFolderList() {
    this.state.account.syncFolderList();
  }
}
