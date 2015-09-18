define(function (require) {
'use strict';

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;
var FormattedRelative = require('react-intl').FormattedRelative;

var WindowedList = require('jsx!../windowed_list');

var ConversationSummary = require('jsx!../summaries/conversation');

var navigate = require('react-mini-router').navigate;

var ConversationListPane = React.createClass({
  mixins: [IntlMixin, React.addons.PureRenderMixin],
  getInitialState: function() {
    return {
      error: null,
      folder: null,
      view: null
    };
  },

  _getConversationView: function(folderId) {
    if (this.state.view) {
      console.log('releasing view in _getConversationView');
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
    console.log('fetching view in _getConversationView');
    this.props.mailApi.eventuallyGetFolderById(folderId).then(
      function gotFolder(folder) {
        this.setState({
          folder: folder,
          view: this.props.mailApi.viewFolderConversations(folder),
          error: false
        });
      }.bind(this),
      function noSuchFolder() {
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
    if (this.props.folderId !== nextProps.folderId) {
      this._getConversationView(nextProps.folderId);
    }
  },

  componentWillUnmount: function() {
    if (this.state.view) {
      console.log('releasing view in unmount');
      this.state.view.release();
    }
  },

  render: function() {
    // Be empty when there's no folder selected.
    if (!this.props.folderId) {
      return <div></div>;
    }

    if (this.state.error) {
      return <div>No SucH FoldeR</div>;
    }

    if (!this.state.folder) {
      return <div>LoadinG FoldeR: {this.props.folderId}...</div>;
    }

    // XXX The foldery things need to go into a sub-widget that explicitly
    // listens on the folder for changes.
    var folder = this.state.folder;

    // TODO: The header likely wants to be a widget that varies based on what
    // the source of the list is.
    return (
      <div className="conversation-list-pane">
        <div className="conversation-list-header">
          <h1 className="conversation-list-name">{ folder.name }</h1>
          <div className="folder-last-sync-date">
            LasT SynC: 
            <FormattedRelative value={ folder.lastSuccessfulSyncAt } />
          </div>
          <div className="conversation-list-actions">
            <button onClick={ this.syncRefresh }><FormattedMessage
              message={ this.getIntlMessage('syncRefresh') }
              />
            </button>
            <button onClick={ this.syncGrowFolder }><FormattedMessage
              message={ this.getIntlMessage('syncGrow') }
              />
            </button>
            <button onClick={ this.ensureSnippets }><FormattedMessage
              message={ this.getIntlMessage('hackManualSnippets') }
              />
            </button>
            <button onClick={ this.beginCompose }><FormattedMessage
              message={ this.getIntlMessage('beginCompose') }
              />
            </button>
          </div>
        </div>
        <div className="conversation-list-scroll-region">
          <WindowedList
            unitSize={ 40 }
            view={ this.state.view }
            widget={ ConversationSummary }
            selectedId={ this.props.selectedId }
            pick={ this.props.pick }
            />
        </div>
      </div>
    );
  },

  syncRefresh: function() {
    if (this.state.view) {
      this.state.view.refresh();
    }
  },

  syncGrowFolder: function() {
    if (this.state.view) {
      this.state.view.grow();
    }
  },

  ensureSnippets: function() {
    if (this.state.view) {
      this.state.view.ensureSnippets();
    }
  },

  /**
   * Begin composing a new message... by jumping to the drafts folder and
   * showing the draft.
   */
  beginCompose: function() {
    this.props.mailApi.beginMessageComposition(
      null, this.state.folder, { command: 'blank', noComposer: true })
    .then(({ id }) => {
      this.props.navigateToDraft(id);
    });
  }
});

return ConversationListPane;
});
