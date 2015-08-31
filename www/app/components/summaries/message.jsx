define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;
var FormattedRelative = require('react-intl').FormattedRelative;

var navigate = require('react-mini-router').navigate;

var SliceItemMixin = require('../slice_item_mixin');

var Star = require('jsx!../actioners/star');
var Unread = require('jsx!../actioners/unread');

var MessageReply = require('jsx!../actioners/message_reply');
var MessageForward = require('jsx!../actioners/message_forward');

var Attachments = require('jsx!./message_attachments');
var MessageBody = require('jsx!./message_body');

var MessageSummary = React.createClass({
  mixins: [IntlMixin, SliceItemMixin],

  getInitialState: function() {
    var message = this.props.item;
    return {
      // expand all messages that are unread or starred
      expanded: !message.isRead || message.isStarred
    };
  },

  defaultProps: {
  },

  render: function() {
    var msg = this.props.item;

    var itemClassNames = 'message-item';
    var envClassNames = 'message-envelope-container';
    var bodyish;
    if (this.state.expanded) {
      // -- Expanded
      itemClassNames += ' message-item-expanded';
      envClassNames += ' message-envelope-expanded';

      bodyish = (
        <div className="message-expanded-region">
          <Attachments key="attachments" message={ msg } />
          <MessageBody key="body" message={ msg } />
        </div>
      );
    } else {
      // -- Collapsed
      itemClassNames += ' message-item-collapsed';
      envClassNames += ' message-envelope-collapsed';
      bodyish = <div className="message-snippet">{ msg.snippet || '' }</div>;
    }

    return (
      <div className={ itemClassNames }>
        <div className={ envClassNames } onClick={ this.toggleExpanded }>
          <div className="message-envelope-row">
            <Unread item={ msg } />
            <Star item={ msg } />
            <div className="message-date">
              <FormattedRelative value={msg.date} />
            </div>
            <div className="message-author">
              { msg.author.name || msg.author.address }
            </div>
            <div className="message-actions">
              <MessageForward {...this.props} item={ msg } />
              <MessageReply {...this.props} item={ msg } />
            </div>
          </div>
        </div>
        { bodyish }
      </div>
    );
  },

  toggleExpanded: function() {
    this.setState({
      expanded: !this.state.expanded
    });
  }
});

return MessageSummary;
});
