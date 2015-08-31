define(function (require) {
'use strict';

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;

var MessageAttachment = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    var attachment = this.props.attachment;
    return (
      <div className="message-attachment-item">
        <div className="message-attachment-mimetype">
          { attachment.mimetype }
        </div>
        <div className="message-attachment-filename">
          { attachment.filename }
        </div>
        <div className="message-attachment-size">
          { attachment.sizeEstimateInBytes }
        </div>
      </div>
    );
  },
});

return MessageAttachment;
});
