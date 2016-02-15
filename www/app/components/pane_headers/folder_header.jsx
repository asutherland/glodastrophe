define(function (require) {
'use strict';

var React = require('react');

var LiveItemMixin = require('../live_item_mixin');

var FolderHeader = React.createClass({
  mixins: [LiveItemMixin],

  render: function() {
    var folder = this.props.item;

    return (
      <div className="folder-header">
        <h1 className="folder-header-name">{ folder.name }</h1>
      </div>
    );
  }
});

return FolderHeader;
});
