define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var ViewSliceList = require('jsx!../view_slice_list');

var ConversationSummary = require('jsx!../summaries/conversation');

var navigate = require('react-mini-router').navigate;

var ConversationListPane = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      error: null,
      folder: null,
      slice: null
    };
  },

  componentWillMount: function() {
    this.props.mailApi.eventuallyGetFolderById(this.props.folderId).then(
      function gotFolder(folder) {
        this.setState({
          folder: folder,
          slice: this.props.mailApi.viewFolderConversations(folder)
        });
      }.bind(this),
      function noSuchFolder() {
        this.setState({
          error: true
        });
      }.bind(this)
    );
  },

  componentWillUnmount: function() {
    if (this.state.slice) {
      this.state.slice.release();
    }
  },

  render: function() {
    if (this.state.error) {
      return <div>No SucH FoldeR</div>;
    }

    if (!this.state.folder) {
      return <div>LoadinG FoldeR: {this.props.folderId}...</div>;
    }

    return (
      <div>
        <h1>{this.state.folder.name}</h1>
        <div>
          <button onClick={ this.syncRefresh }><FormattedMessage
            message={ this.getIntlMessage('syncRefresh') }
            />
          </button>
          <button onClick={ this.syncGrowFolder }><FormattedMessage
            message={ this.getIntlMessage('syncGrow') }
            />
          </button>
        </div>
        <ViewSliceList
          slice={this.state.slice}
          widget={ConversationSummary}
          />
      </div>
    );
  },

  syncRefresh: function() {
    if (this.state.slice) {
      this.state.slice.refresh();
    }
  },

  syncGrowFolder: function() {
    if (this.state.slice) {
      this.state.slice.grow();
    }
  }
});

return ConversationListPane;
});
