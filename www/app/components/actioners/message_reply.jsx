define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

/**
 * Reply button for a message.  In theory this could get fancy and provide magic
 * expanding support for reply all/reply list/forward/etc./etc.
 */
var MessageReply = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    return (
      <button className="message-action-reply"
              onClick={ this.clickReply }>
        <FormattedMessage
          message={ this.getIntlMessage('messageReply') } />
      </button>
    );
  },

  clickReply: function() {
    this.props.item.replyToMessage('all');
  }
});

return MessageReply;
});
