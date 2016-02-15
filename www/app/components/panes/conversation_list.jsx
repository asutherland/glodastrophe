define(function (require) {
'use strict';

var React = require('react');

var FormattedMessage = require('react-intl').FormattedMessage;
var FormattedRelative = require('react-intl').FormattedRelative;

var WindowedList = require('../windowed_list');

var ConvFilterBar = require('../filter_bar/conv_filter_bar');

// TODO: these should be parametrized
var FolderHeader = require('../pane_headers/folder_header');

var ConversationSummary = require('../summaries/conversation');

var PureRenderMixin = require('react-addons-pure-render-mixin');

var ConversationListPane = React.createClass({
  mixins: [PureRenderMixin],
  getInitialState: function() {
    return {
      error: null,
      folder: null,
      view: null,
      newishCount: null,
      filter: null
    };
  },

  _getConversationView: function(folderId, filter) {
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
        let view;
        if (!filter) {
          view = this.props.mailApi.viewFolderConversations(folder);
        } else {
          view = this.props.mailApi.searchFolderConversations({
            folder,
            filter
          });
        }
        view.on('metaChange', this.onMetaChange);
        view.on('syncComplete', this.onSyncComplete);
        this.setState({
          folder,
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
    this._getConversationView(this.props.folderId, null);
  },

  componentWillUpdate: function(nextProps, nextState) {
    if (this.props.folderId !== nextProps.folderId ||
        this.state.filter !== nextState.filter) {
      // XXX this calls setState so this is the worst.  We need to address the
      // state management badly now.  Same in message_list.
      window.setTimeout(() => {
        this._getConversationView(nextProps.folderId, nextState.filter);
      }, 0);
    }
  },

  componentWillUnmount: function() {
    if (this.state.view) {
      console.log('releasing view in unmount');
      this.state.view.release();
    }
  },

  applyFilter: function(filter) {
    this.setState({
      filter
    });
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
          id='folderLastSyncLabel'
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
        <div key="newish" className="conversation-list-newish-box">
          <FormattedMessage
            id='newishCountDisplay'
            values={ { newishCount: this.state.newishCount } }
            />
          <button onClick={ this.clearNewishCount }>
            <FormattedMessage
              id='clearNewishCount'
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
              id='syncRefresh'
              />
            </button>
            <button onClick={ this.syncGrowFolder }><FormattedMessage
              id='syncGrow'
              />
            </button>
            <button onClick={ this.ensureSnippets }><FormattedMessage
              id='hackManualSnippets'
              />
            </button>
            <button onClick={ this.beginCompose }><FormattedMessage
              id='beginCompose'
              />
            </button>
          </div>
          <ConvFilterBar key="cfb"
            initialFilter={ this.state.filter }
            applyFilter={ this.applyFilter }
            />
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
