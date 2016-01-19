define(function (require) {
'use strict';

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;
var FormattedRelative = require('react-intl').FormattedRelative;

var WindowedList = require('jsx!../windowed_list');

// TODO: these should be parametrized
var FolderHeader = require('jsx!../pane_headers/folder_header');
var ConversationSummary = require('jsx!../summaries/conversation');

var ConversationListPane = React.createClass({
  mixins: [IntlMixin, React.addons.PureRenderMixin],
  getInitialState: function() {
    return {
      error: null,
      folder: null,
      view: null,
      newishCount: null
    };
  },

  _getConversationView: function(folderId) {
    if (this.state.view) {
      console.log('releasing view in _getConversationView');
      this.state.view.removeListener('metaChange', this.onMetaChange);
      this.state.view.removeListener('syncComplete', this.onSyncComplete);
      this.state.view.release();
    }

    if (!folderId) {
      this.setState({
        error: null,
        folder: null,
        view: null,
        newishCount: null
      });
      return;
    }

    // Make sure any already existing view is forgotten since the below lookup
    // is async and we want to forget the view in the same turn we release it.
    this.setState({
      view: null,
      newishCount: null
    });
    console.log('fetching view in _getConversationView');
    this.props.mailApi.eventuallyGetFolderById(folderId).then(
      function gotFolder(folder) {
        let view = this.props.mailApi.viewFolderConversations(folder);
        view.on('metaChange', this.onMetaChange);
        view.on('syncComplete', this.onSyncComplete);
        this.setState({
          folder: folder,
          view,
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

  componentDidMount: function() {
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

  onMetaChange: function() {
    // NB: metaChange is smart enough to only trigger on deltas
    // We don't do serial tracking on ourselves, so just trigger a forceUpdate.
    this.forceUpdate();
  },

  onSyncComplete: function({ newishCount }) {
    this.setState({
      newishCount
    });
  },

  render: function() {
    // Be empty when there's no folder selected.
    if (!this.props.folderId) {
      return <div></div>;
    }

    if (this.state.error) {
      return <div>No SucH FoldeR</div>;
    }

    if (!this.state.folder || !this.state.view) {
      return <div>LoadinG FoldeR: {this.props.folderId}...</div>;
    }

    var folder = this.state.folder;
    // XXX make the actual widget in use configurable, etc.

    // This now only provides the identifying string and same-row metadata
    var headerWidget = <FolderHeader item={ folder } />;

    var view = this.state.view;
    var tocMeta = view.tocMeta;
    var maybeSyncStatus, maybeSyncBlocked;
    if (tocMeta.syncStatus) {
      maybeSyncStatus = (
        <span key="syncstatus"> [{ tocMeta.syncStatus }]</span>
      );
    }
    if (tocMeta.syncBlocked) {
      maybeSyncBlocked = (
        <span key="syncblocked"> [{ tocMeta.syncBlocked }]</span>
      );
    }
    var viewWidget = (
      <div className="folder-last-sync-date">
        <FormattedMessage
          message={ this.getIntlMessage('folderLastSyncLabel') }
          /> <FormattedRelative value={ tocMeta.lastSuccessfulSyncAt || 0 } />
        { maybeSyncStatus }
        { maybeSyncBlocked }
      </div>
    );

    var newishWidget = null;
    if (this.state.newishCount) {
      // XXX this is a hack testing feature.  But gaia mail's blue new mail bar
      // is actually not bad UX, so it would be appropriate to clean this up
      // and make it work the same.  (Specifically, there isn't really a need
      // to show the bar if we're already at the top, only if we're not.  And
      // clicking the bar should clear and seek to the top.)
      newishWidget = (
        <div className="conversation-list-newish-box">
          <FormattedMessage
            message={ this.getIntlMessage('newishCountDisplay') }
            newishCount={ this.state.newishCount }
            />
          <button onClick={ this.clearNewishCount }>
            <FormattedMessage
              message={ this.getIntlMessage('clearNewishCount') }
              />
          </button>
        </div>
      );
    }


    // TODO: The header likely wants to be a widget that varies based on what
    // the source of the list is.
    return (
      <div className="conversation-list-pane">
        <div className="conversation-list-header">
          { headerWidget }
          { viewWidget }
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
          { newishWidget }
        </div>
        <div className="conversation-list-scroll-region">
          <WindowedList
            unitSize={ 40 }
            view={ view }
            widget={ ConversationSummary }
            selectedId={ this.props.selectedId }
            pick={ this.props.pick }
            />
        </div>
      </div>
    );
  },

  clearNewishCount: function() {
    this.setState({
      newishCount: null
    });
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
