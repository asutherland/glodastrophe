define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

/**
 * Render a tag/label thing with an 'x' button-ish thing to be able to remove
 * the tag/label.  Maybe it'll also eventually be able to do other stuff like
 * display a complicated menu to punish users for clicking on anything but the
 * small 'x'.
 */
var Taggy = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    var classes = 'taggy-item';
    var folder = this.props.folder;

    return (
      <div className={ classes } onClick={ this.clickFolder }>
        <span className="taggy-name">{ folder.name }</span>
        <button className="taggy-remove-button">X</button>
      </div>
    );
  },

  clickFolder: function() {
    if (this.props.pick) {
      this.props.pick(this.props.item);
    }
  }
});

return Taggy;
});
