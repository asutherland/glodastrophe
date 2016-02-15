define(function (require) {
'use strict';

var React = require('react');

/**
 * Render a tag/label thing with an 'x' button-ish thing to be able to remove
 * the tag/label.  Maybe it'll also eventually be able to do other stuff like
 * display a complicated menu to punish users for clicking on anything but the
 * small 'x'.
 */
var Unread = React.createClass({
  render: function() {
    var item = this.props.item;
    var classes = 'unread-widget ' +
      (item.isRead ? 'unread-widget-read' : 'unread-widget-unread');
    var unreadChar = item.isRead ? '\u26aa' : '\u26ab';

    return (
      <span className={ classes } onClick={ this.clickToggle }>
        { unreadChar }
      </span>
    );
  },

  clickToggle: function(event) {
    event.stopPropagation();
    this.props.item.toggleRead();
  }
});

return Unread;
});
