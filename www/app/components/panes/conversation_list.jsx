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

/**
 * Display the list of conversations in a folder/whatever with a summary at the
 * top.
 */
var ConversationListPane = React.createClass({
  mixins: [PureRenderMixin],

  componentDidMount: function() {
    const view = this.props.view;
    if (view) {
      view.on('metaChange', this.onMetaChange);
      view.on('syncComplete', this.onSyncComplete);
    }
  },

  componentWillUpdate: function(nextProps/*, nextState*/) {
    // We use this instead of componentWillReceiveProps because this only gets
    // called if shouldComponentUpdate returned true which means we're slightly
    // more debounced.
    const oldView = this.props.view;
    const newView = nextProps.view;
    if (oldView !== newView) {
      if (oldView) {
        oldView.removeListener('metaChange', this.onMetaChange);
        oldView.removeListener('syncComplete', this.onSyncCompleted);
      }

      if (newView) {
        newView.on('metaChange', this.onMetaChange);
        newView.on('syncComplete', this.onSyncComplete);
      }
    }
  },

  componentWillUnmount: function() {
    const view = this.props.view;
    if (view) {
      view.removeListener('metaChange', this.onMetaChange);
      view.removeListener('syncComplete', this.onSyncCompleted);
    }
  },

  onMetaChange: function() {
    // NB: metaChange is smart enough to only trigger on deltas
    // We don't do serial tracking on ourselves, so just trigger a forceUpdate.
    this.forceUpdate();
  },

  onSyncComplete: function(/*{ newishCount }*/) {
    // I'm leaving this stub here as a reminder we have this functionality in
    // case we want to put back a feature that helps indicate that new messages
    // have shown up at the top of the list view.  It might be more appropriate
    // to have something in our redux infra that instead generates an action
    // that updates this state or to have the view automatically track this as
    // a flag that's automatically tracked based on scroll position and instead
    // we just know to update when it changes state like we do for a meta
    // change.
  },

  render: function() {
    const view = this.props.view;

    // Be empty if there's no view.
    if (!view) {
      return <div></div>;
    }

    const folder = this.props.folder;
    // XXX make the actual widget in use configurable, etc.
    // This now only provides the identifying string and same-row metadata
    const headerWidget = <FolderHeader item={ folder } />;

    const tocMeta = view.tocMeta;
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
    this.props.view.refresh();
  },

  syncGrowFolder: function() {
    this.props.view.grow();
  },

  ensureSnippets: function() {
    // XXX this was brought into existence
    this.props.view.ensureSnippets();
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
