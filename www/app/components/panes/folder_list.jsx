define(function (require) {
'use strict';

var React = require('react');

var FormattedMessage = require('react-intl').FormattedMessage;

var EntireList = require('../entire_list');

var FolderSummary = require('../summaries/folder');

var PureRenderMixin = require('react-addons-pure-render-mixin');

var FolderListPane = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return {
      error: null,
      account: null,
    };
  },

  _getAccount: function(accountId) {
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
  },

  componentWillMount: function() {
    this._getAccount(this.props.accountId);
  },

  componentWillReceiveProps: function(nextProps) {
    this._getAccount(nextProps.accountId);
  },

  componentWillUnmount: function() {
    // We don't want to release the folders view; it's not owned by us.
  },

  render: function() {
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
          <FormattedMessage
            id='refreshFolderList'
            />
        </button>
      </div>
    );
  },

  syncFolderList: function() {
    this.state.account.syncFolderList();
  }
});

return FolderListPane;
});
