define(function (require) {
'use strict';

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;

/**
 * Render a message recipient with an 'x' button to be able to remove them in
 * a composition/write context.  Differs from `ReaderPeep` which exists in a
 * reading context.
 */
var ComposeAttachment = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    var attachment = this.props.attachment;

    return (
      <div className="compose-attachment">
        <span className="compose-attachment-name">{ attachment.name }</span>
        <span className="compose-attachment-type">{ attachment.type }</span>
        <span className="compose-attachment-size">
          { attachment.sizeEstimate }
        </span>
        <button className="compose-attachment-remove-button"
                onClick={ this.clickRemove }>
          X
        </button>
      </div>
    );
  },

  clickRemove: function() {
    this.props.composer.removeAttachment(this.props.attachment);
  }
});

return ComposeAttachment;
});
