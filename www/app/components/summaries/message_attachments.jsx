define(function (require) {
'use strict';

var React = require('react');

var Attachment = require('./message_attachment');

var MessageAttachments = React.createClass({
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
