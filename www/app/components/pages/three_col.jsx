import React from 'react';

import SelectedSidebarMenu from
  '../../containers/selected_sidebar_menu';

import SelectedConversationListHeader from
  '../../containers/selected_conversation_list_header';
import SelectedOverviewFacetsPane from
  '../../containers/selected_overview_facets_pane';
import SelectedSidebarFacetsPane from
  '../../containers/selected_sidebar_facets_pane';
import SelectedConversationListPane from
  '../../containers/selected_conversation_list_pane';

import SelectedMessageListHeader from
  '../../containers/selected_message_list_header';
import SelectedMessageListPane from
  '../../containers/selected_message_list_pane';

/*
 * Our split-panes use localStorage as a least-bad option for UI persistance
 * throughout the development process.  Now that we've got redux in play, it
 * might be feasible and practical to have it manage the state instead.
 */
import SplitPane from 'react-split-pane';
const splitRestore = name => localStorage.getItem(name);
const splitSave = function(name) {
  return (size) => { localStorage.setItem(name, size); };
};

/**
 * The conversation pane wants to be a flex-box header at the top that uses its
 * native size and whose second child takes the remainder and which wants to
 * be its own containing block for height sizing purposes.  The heigh need is
 * driven by SplitPane's needs at this time.  We can change it in the future.
 */
const CONVERSATION_PANE_CONTAINER = {
};

const CONVERSATION_PANE_HEADER = {
  height: '128px'
};

const CONVERSATION_PANE_SCROLL_REGION = {
  height: 'calc(100% - 128px)',
  width: '100%',
  position: 'absolute',
  top: '128px',
  left: '0'
};

/**
 * Three column view where the columns are facets, conversation list, message
 * list.  The traditional three-pane column containing the folder list has been
 * exiled into the hamburger-menu-triggered sidebar (which we also create).
 *
 * ASCII-art wise, the layout breaks down as follows, with the facet /
 * conversations split only happening beneath the conversation list header.
 * But that could change.
 *     CONVERSATION LIST HEADER |  MESSAGE LIST HEADER
 *     .........................|......................
 *     FACET | CONVERSATION     |  MESSAGE
 *     FACET | CONVERSATION     |  MESSAGE
 *     FACET | CONVERSATION     |  MESSAGE
 *
 *
 */
export default class ThreeCol extends React.Component {
  render() {
    return (
      <SplitPane split='vertical'
        defaultSize={ splitRestore('3col:split0') }
        onChange={ splitSave('3col:split0') }
        >
        <SelectedSidebarMenu />
        <div>
          <SplitPane split="vertical"
                    defaultSize={ splitRestore('3col:split1') }
                    onChange={ splitSave('3col:split1') }>
            <div style={ CONVERSATION_PANE_CONTAINER }>
              <div style={ CONVERSATION_PANE_HEADER }>
                <SelectedConversationListHeader />
                <SelectedOverviewFacetsPane />
              </div>
              <div style={ CONVERSATION_PANE_SCROLL_REGION }>
                {/*<SplitPane split="vertical"
                          defaultSize={ splitRestore('3col:split2') }
                          onChange={ splitSave('3col:split2') }>
                  <SelectedSidebarFacetsPane /> */}
                  <SelectedConversationListPane />
                {/*</SplitPane>*/}
              </div>
            </div>
            <div className="message-list-pane">
              <SelectedMessageListHeader />
              <SelectedMessageListPane />
            </div>
          </SplitPane>
        </div>
      </SplitPane>
    );
  }
}
