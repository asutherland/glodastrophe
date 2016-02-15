define(function (require) {
'use strict';

var React = require('react');

var FormattedMessage = require('react-intl').FormattedMessage;

/**
 * Reply button for a message.  In theory this could get fancy and provide magic
 * expanding support for reply all/reply list/forward/etc./etc.
 */
var MessageReply = React.createClass({
  render: function() {
    return (
      <button className="message-action-reply"
              onClick={ this.clickReply }>
        <FormattedMessage
          id='messageReply' />
      </button>
    );
  },

  clickReply: function(event) {
    event.stopPropagation();
    // Pass noComposer so that a MessageComposition is not automatically created
    // for us and instead
    this.props.item.replyToMessage('all', { noComposer: true });
  }
});

return MessageReply;
});
