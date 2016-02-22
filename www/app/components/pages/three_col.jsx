define(function (require) {
'use strict';

const React = require('react');

const SelectedSidebarMenu =
  require('../../containers/selected_sidebar_menu');
const SelectedConversationListHeader =
    require('../../containers/selected_conversation_list_header');

const SelectedConversationListPane =
  require('../../containers/selected_conversation_list_pane');
const SelectedMessageListPane =
  require('../../containers/selected_message_list_pane');

/*
 * Our split-panes use localStorage as a least-bad option for UI persistance
 * throughout the development process.  Now that we've got redux in play, it
 * might be feasible and practical to have it manage the state instead.
 */
const SplitPane = require('react-split-pane');
const splitRestore = name => localStorage.getItem(name);
const splitSave = function(name) {
  return (size) => { localStorage.setItem(name, size); };
};

/**
 * Three column view where the columns are facets, conversation list, message
 * list.  The traditional three-pane view with the folder list has been exiled
 * into the hamburger-menu-triggered sidebar (which we also create).
 */
var ThreeCol = React.createClass({
  render: function() {
    return (
      <div>
        <SelectedSidebarMenu />
        <SplitPane split="vertical"
                   defaultSize={ splitRestore('3col:split1') }
                   onChange={ splitSave('3col:split1') }>
          <div>
            <SelectedConversationListHeader />
            <SelectedOverviewFacetsPane />
            <SplitPane split="vertical"
                       defaultSize={ splitRestore('3col:split2') }
                       onChange={ splitSave('3col:split2') }>
              <SelectedSidebarFacetsPane />
              <SelectedConversationListPane />
            </SplitPane>
          </div>
          <SelectedMessageListPane />
        </SplitPane>
      </div>
    );
  },
});

return ThreeCol;
});
