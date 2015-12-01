define(function (require) {
'use strict';

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var FolderSummary = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    let classes = 'folder-item';
    if (this.props.selected) {
      classes += ' folder-item-selected';
    }

    let folder = this.props.item;
    let { selectable } = folder;
    classes += ' folder-depth' + folder.depth;
    classes += selectable ? ' folder-selectable' : ' folder-unselectable';

    let selectableStuff;
    if (selectable) {
      let maybeSyncStatus;
      if (folder.syncStatus) {
        maybeSyncStatus = <span> [{folder.syncStatus}]</span>;
      }
      selectableStuff = (
        <span>
          <span> ({ folder.localUnreadConversations })</span>
          { maybeSyncStatus }
        </span>
      );
    }

    var tooltip = [
      'local unread conversations: ' + folder.localUnreadConversations,
      'local message count: ' + folder.localMessageCount,
      'fully synced: ' + folder.fullySynced
    ].join('\n');

    return (
      <div className={ classes }
           title={ tooltip }
           onClick={ this.clickFolder }>
        <span>{ folder.name }</span>
        { selectableStuff }
      </div>
    );
  },

  clickFolder: function() {
    if (this.props.pick && this.props.item.selectable) {
      this.props.pick(this.props.item);
    }
  }
});

return FolderSummary;
});
