define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var ViewSliceList = require('jsx!../view_slice_list');

var FolderSummary = require('jsx!../summaries/folder');

var navigate = require('react-mini-router').navigate;

var FolderListPane = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      error: null,
      account: null,
    };
  },

  componentWillMount: function() {
    this.props.mailApi.eventuallyGetAccountById(this.props.accountId).then(
      function gotAccount(account) {
        console.log('got account', account);
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

  componentWillUnmount: function() {

  },

  render: function() {
    if (this.state.error) {
      return <div>No SucH AccounT</div>;
    }

    if (!this.state.account) {
      return <div>LoadinG AccounT...</div>;
    }

console.log('trying to render ViewSlice for accounts');
    return (
      <div>
        <ViewSliceList
          slice={this.state.account.folders}
          widget={FolderSummary}
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
