import React from 'react';
import PropTypes from 'prop-types';

import { Dropdown, Menu } from 'semantic-ui-react';
import { Localized } from '@fluent/react';

//const ConvFilterBar = require('../filter_bar/conv_filter_bar');


/**
 * The header and interface for a list of conversations.
 */
export default class ConversationListHeader extends React.PureComponent {
  getInitialState() {
    return {};
  }

  componentDidMount() {
    const view = this.props.view;
    if (view) {
      view.on('metaChange', this.onMetaChange);
      view.on('syncComplete', this.onSyncComplete);
    }
  }

  componentWillUpdate(nextProps/*, nextState*/) {
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
  }

  componentWillUnmount() {
    const view = this.props.view;
    if (view) {
      view.removeListener('metaChange', this.onMetaChange);
      view.removeListener('syncComplete', this.onSyncComplete);
    }
  }

  onMetaChange() {
    // NB: metaChange is smart enough to only trigger on deltas
    // We don't do serial tracking on ourselves, so just trigger a forceUpdate.
    this.forceUpdate();
  }

  onSyncComplete(/*{ newishCount }*/) {
    // I'm leaving this stub here as a reminder we have this functionality in
    // case we want to put back a feature that helps indicate that new messages
    // have shown up at the top of the list view.  It might be more appropriate
    // to have something in our redux infra that instead generates an action
    // that updates this state or to have the view automatically track this as
    // a flag that's automatically tracked based on scroll position and instead
    // we just know to update when it changes state like we do for a meta
    // change.
  }

  render() {
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

    // NB: The MenuItem nesting idiom using props like this is a little awkward.
    // I'm flattening things because I've had trouble with the linter not
    // seeming to handle JSX inside prop values and because it's really weird
    // non-idiomatic stuff that does bad indentation things.

    const sidebarAddMenuItems =
      this.props.conversationSidebarDefsView.items.map((viewDef) => {
        const addVis = () => {
          this.props.onAddSidebarVis(viewDef);
        };
        return (
          <Dropdown.Item
            text={ viewDef.name }
            onClick={ addVis }
            />
        );
      });

    // XXX localize tooltips here that are unable to be a Localize element.
    // (Doing this easily wants this component re-written to use hooks.)
    // localization id for toggle sidebar will be: 'toggle_sidebar'
    return (
      <Menu>
        <Menu.Item
          icon='sidebar'
          title='TogglE SidebaR'
          onClick={ this.props.onToggleSidebar }
          />
        <Dropdown item icon='tasks' position='right'>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={ this.onBeginCompose }
              >
              <Localized id='conversations_compose_menu_item' />
            </Dropdown.Item>
            <Dropdown.Item
              onClick={ this.onRefreshView }
              >
              <Localized id='conversations_refresh_view_menu_item' />
            </Dropdown.Item>
            <Dropdown.Item
              onClick={ this.onGrowView }
              >
              <Localized id='conversations_grow_view_menu_item' />
            </Dropdown.Item>
            <Dropdown.Item
              onClick={ this.onBeginCompose }
              >
              <Localized id='visualizations_adding_menu_root' />
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Localized id='visualizations_sidebar_menu_add_root' />
                  <Dropdown.Menu>
                    { sidebarAddMenuItems }
                  </Dropdown.Menu>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
    );
  }

  onRefreshView() {
    this.props.view.refresh();
  }

  onGrowView() {
    this.props.view.grow();
  }

  /**
   * Begin composing a new message... by jumping to the drafts folder and
   * showing the draft.
   */
  onBeginCompose() {
    this.props.mailApi.beginMessageComposition(
      null, this.props.view.folder, { command: 'blank', noComposer: true })
    .then(({ id }) => {
      this.props.onNavigateToDraft(id);
    });
  }
};

ConversationListHeader.propTypes = {
  conversationSidebarDefsView: PropTypes.object,
  mailApi: PropTypes.object.isRequired,
  view: PropTypes.object,
  viewTocMetaSerial: PropTypes.number,
  onAddSidebarVis: PropTypes.func.isRequired,
  onNavigateToDraft: PropTypes.func.isRequired,
  onToggleSidebar: PropTypes.func.isRequired,
};
