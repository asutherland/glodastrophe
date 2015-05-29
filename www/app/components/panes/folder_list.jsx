define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var EntireList = require('jsx!../entire_list');

var FolderSummary = require('jsx!../summaries/folder');

var navigate = require('react-mini-router').navigate;

var FolderListPane = React.createClass({
  mixins: [IntlMixin, React.addons.PureRenderMixin],

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
      return <div></div>
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
            message={ this.getIntlMessage('refreshFolderList') }
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
