import React from 'react';

/**
 * Render a tag/label thing with an 'x' button-ish thing to be able to remove
 * the tag/label.  Maybe it'll also eventually be able to do other stuff like
 * display a complicated menu to punish users for clicking on anything but the
 * small 'x'.
 */
export default class Taggy extends React.Component {
  render() {
    var classes = 'taggy-item';
    var folder = this.props.folder;

    return (
      <div className={ classes } onClick={ this.clickFolder }>
        <span className="taggy-name">{ folder.name }</span>
        <button className="taggy-remove-button" onClick={ this.clickRemove }>
          X
        </button>
      </div>
    );
  }

  clickFolder(event) {
    event.stopPropagation();
    if (this.props.pick) {
      this.props.pick(this.props.folder);
    }
  }

  clickRemove(event) {
    event.stopPropagation();
    if (this.props.labelOwner) {
      this.props.labelOwner.removeLabels([this.props.folder]);
    }
  }
};
