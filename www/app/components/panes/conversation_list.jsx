define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var WindowedList = require('jsx!../windowed_list');

var ConversationSummary = require('jsx!../summaries/conversation');

var navigate = require('react-mini-router').navigate;

var ConversationListPane = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      error: null,
      folder: null,
      view: null
    };
  },

  _getConversationView: function(folderId) {
    if (this.state.view) {
      this.state.view.release();
    }

    if (!folderId) {
      this.setState({
        error: null,
        folder: null,
        view: null
      });
      return;
    }

    // Make sure any already existing view is forgotten since the below lookup
    // is async and we want to forget the view in the same turn we release it.
    this.setState({
      view: null
    });
console.log('trying to get folder', folderId);
    this.props.mailApi.eventuallyGetFolderById(folderId).then(
      function gotFolder(folder) {
console.log('GOT IT!');
        this.setState({
          folder: folder,
          view: this.props.mailApi.viewFolderConversations(folder),
          error: false
        });
      }.bind(this),
      function noSuchFolder(err) {
console.log('BOO NO NO NO', err);
        this.setState({
          folder: null,
          view: null,
          error: true
        });
      }.bind(this)
    );
  },

  componentWillMount: function() {
    this._getConversationView(this.props.folderId);
  },

  componentWillReceiveProps: function(nextProps) {
    this._getConversationView(nextProps.folderId);
  },

  componentWillUnmount: function() {
    if (this.state.view) {
      this.state.view.release();
    }
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return true;
  },

  render: function() {
    // Be empty when there's no folder selected.
    if (!this.props.folderId) {
      return <div></div>
    }

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
          <button onClick={ this.ensureSnippets }>EnsurE SnippetS</button>
        </div>
        <WindowedList
          unitSize={ 20 }
          view={ this.state.view }
          widget={ ConversationSummary }
          pick={ this.props.pick }
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
  },

  ensureSnippets: function() {
    if (this.state.slice) {
      this.state.slice.ensureSnippets();
    }
  }
});

return ConversationListPane;
});
