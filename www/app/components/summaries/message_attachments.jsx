define(function (require) {
'use strict';

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;

var Attachment = require('jsx!./message_attachment');

var MessageAttachments = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    var msg = this.props.message;

    var attachments = msg.attachments.map((attachment) => {
      return (
        <Attachment key={ attachment.partId }
          attachment={ attachment } />
      );
    });

    return (
      <div className="message-attachments">
        { attachments }
      </div>
    );
  },
});

return MessageAttachments;
});
