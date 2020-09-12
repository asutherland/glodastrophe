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
            <div className="conversation-list-pane">
              <div className="conversation-list-pane-header">
                <SelectedConversationListHeader />
                <SelectedOverviewFacetsPane />
              </div>
              <div className="conversation-list-scroll-region">
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
