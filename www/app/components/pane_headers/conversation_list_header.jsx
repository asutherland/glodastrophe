define(function (require) {
'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');

const { injectIntl } = require('react-intl');

const AppBar = require('material-ui/lib/app-bar');
const FontIcon = require('material-ui/lib/font-icon');
const IconButton = require('material-ui/lib/icon-button');
const IconMenu = require('material-ui/lib/menus/icon-menu');
const MenuItem = require('material-ui/lib/menus/menu-item');

//const ConvFilterBar = require('../filter_bar/conv_filter_bar');


/**
 * The header and interface for a list of conversations.
 */
const ConversationListHeader = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    mailApi: React.PropTypes.object.isRequired,
    view: React.PropTypes.object,
    viewTocMetaSerial: React.PropTypes.number,
    onNavigateToDraft: React.PropTypes.func.isRequired,
    onToggleSidebar: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return {};
  },

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
        oldView.removeListener('syncComplete', this.onSyncComplete);
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
      view.removeListener('syncComplete', this.onSyncComplete);
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

    if (!view) {
      return <div></div>;
    }

    const tocMeta = view.tocMeta;
    // Start with the folder name.
    let title = view.folder.name;
    // Now super debug hackily add some tocMeta status onto it.
    if (tocMeta.syncStatus) {
      title += ` [${tocMeta.syncStatus}]`;
    }
    if (tocMeta.syncBlocked) {
      title += ` [${tocMeta.syncBlocked}]`;
    }

    // We could possibly also include tocMeta.lastSuccessfulSyncAt.
    // UX-wise, I'm thinking it'd be better to have an exceptional state for us
    // being offline/disconnected that explains when we went offline/lost
    // connectivity, etc. rather than having an omnipresent distraction that
    // requires user attention to interpret.

    const menuButton = (
      <IconButton
        tooltip={ this.props.intl.formatMessage({ id: 'toggle_sidebar' }) }
        onTouchTap={ this.props.onToggleSidebar } >
        <FontIcon className="material-icons">menu</FontIcon>
      </IconButton>
    );

    const actionMenuButton =
      <IconButton>
        <FontIcon className="material-icons">more_vert</FontIcon>
      </IconButton>;
    const actionMenu = (
      <IconMenu iconButtonElement={ actionMenuButton }>
        <MenuItem
          primaryText={ this.props.intl.formatMessage({ id: 'conversations_compose_menu_item' }) }
          onTouchTap={ this.onBeginCompose } />
        <MenuItem
          primaryText={ this.props.intl.formatMessage({ id: 'conversations_refresh_view_menu_item' }) }
          onTouchTap={ this.onRefreshView } />
        <MenuItem
          primaryText={ this.props.intl.formatMessage({ id: 'conversations_grow_view_menu_item' }) }
          onTouchTap={ this.onGrowView } />
      </IconMenu>
    );

    return (
      <div>
        <AppBar
          title={ title }
          iconElementLeft={ menuButton }
          iconElementRight={ actionMenu }
          onTitleTouchTap={ this.props.onToggleSidebar }
          />
      </div>
    );
  },

  onRefreshView: function() {
    this.props.view.refresh();
  },

  onGrowView: function() {
    this.props.view.grow();
  },

  /**
   * Begin composing a new message... by jumping to the drafts folder and
   * showing the draft.
   */
  onBeginCompose: function() {
    this.props.mailApi.beginMessageComposition(
      null, this.props.view.folder, { command: 'blank', noComposer: true })
    .then(({ id }) => {
      this.props.onNavigateToDraft(id);
    });
  }

});

return injectIntl(ConversationListHeader);
});
