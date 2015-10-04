define(function (require) {
'use strict';

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;
var FormattedRelative = require('react-intl').FormattedRelative;

var LiveItemMixin = require('../live_item_mixin');

var FolderHeader = React.createClass({
  mixins: [IntlMixin, LiveItemMixin],

  render: function() {
    var folder = this.props.item;

    var maybeSyncStatus;
    if (folder.syncStatus) {
      maybeSyncStatus = <span> [{ folder.syncStatus }]</span>;
    }

    return (
      <div className="folder-header">
        <h1 className="folder-header-name">{ folder.name }</h1>
        <div className="folder-last-sync-date">
          <FormattedMessage
            message={ this.getIntlMessage('folderLastSyncLabel') }
            /> <FormattedRelative value={ folder.lastSuccessfulSyncAt } />
          { maybeSyncStatus }
        </div>
      </div>
    );
  }
});

return FolderHeader;
});
