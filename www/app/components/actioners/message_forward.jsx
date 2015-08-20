define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

/**
 * Reply button for a message.  In theory this could get fancy and provide magic
 * expanding support for reply all/reply list/forward/etc./etc.
 */
var MessageForward = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    return (
      <button className="message-action-forward"
              onClick={ this.clickForward }>
        <FormattedMessage
          message={ this.getIntlMessage('messageForward') } />
      </button>
    );
  },

  clickForward: function() {
    // Pass noComposer so that a MessageComposition is not automatically created
    // for us and instead
    this.props.item.forwardMessage('inline', { noComposer: true });
  }
});

return MessageForward;
});
