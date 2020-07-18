import React from 'react';


/**
 * Render a tag/label thing with an 'x' button-ish thing to be able to remove
 * the tag/label.  Maybe it'll also eventually be able to do other stuff like
 * display a complicated menu to punish users for clicking on anything but the
 * small 'x'.
 */
export default class Star extends React.Component {
  render() {
    var item = this.props.item;
    var classes = 'star-widget ' +
      (item.isStarred ? 'star-widget-starred' : 'star-widget-unstarred');
    var starChar = item.isStarred ? '\u2605' : '\u2606';

    return (
      <span className={ classes } onClick={ this.clickToggle }>
        { starChar }
      </span>
    );
  }

  clickToggle(event) {
    event.stopPropagation();
    this.props.item.toggleStarred();
  }
};
