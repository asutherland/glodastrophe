import React from 'react';

/**
 * This attempts to convey whether a convesration/message is read/unread.  The
 * inspiration clearly came from Thunderbird's thread pane approach, but the
 * use of Unicode characters limited it.  We now have icons we can use and
 * should almost certainly switch to them.
 */
export default class Unread extends React.Component {
  render() {
    var item = this.props.item;
    var classes = 'unread-widget ' +
      (item.isRead ? 'unread-widget-read' : 'unread-widget-unread');
    var unreadChar = item.isRead ? '\u26ac' : '\u26aa';

    return (
      <span className={ classes } onClick={ this.clickToggle }>
        { unreadChar }
      </span>
    );
  }

  clickToggle(event) {
    event.stopPropagation();
    this.props.item.toggleRead();
  }
}
