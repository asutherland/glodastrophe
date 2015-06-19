define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;
var FormattedRelative = require('react-intl').FormattedRelative;

var navigate = require('react-mini-router').navigate;

var SliceItemMixin = require('../slice_item_mixin');

var Star = require('jsx!../actioners/star');
var Unread = require('jsx!../actioners/unread');


var Attachment = require('jsx!./message_attachment');
var MessageBody = require('jsx!./message_body');

var MessageSummary = React.createClass({
  mixins: [IntlMixin, SliceItemMixin],

  getInitialState: function() {
    var message = this.props.item;
    return {
      // expand all messages that are unread or starred
      expanded: !message.isRead || message.isStarred
    }
  },

  defaultProps: {
  },

  render: function() {
    var msg = this.props.item;

    var attachmentish;
    if (msg.attachments.length) {
    }

    var bodyish;
    if (this.state.expanded) {
      bodyish = <MessageBody key="body" message={ msg } />;
    } else {
      bodyish = <div className="message-snippet">{ msg.snippet || '' }</div>;
    }

    return (
      // XXX we can't use an 'a' link because BAD things happen if multiple
      // tabs with us inside get opened.  Need SharedWorkers!
      <div className="message-item" onClick={ this.clickMessage }>
        <div className="message-envelope-container">
          <div className="message-envelope-row">
            <Unread item={ msg } />
            <Star item={ msg } />
            <div className="message-date">
              <FormattedRelative value={msg.date} />
            </div>
            <div className="message-author">
              { msg.author.name || msg.author.address }
            </div>
          </div>
        </div>
        { attachmentish }
        { bodyish }
      </div>
    );
  },

  clickMessage: function() {
    if (this.props.pick) {
      this.props.pick(this.props.item);
    }
  }
});

return MessageSummary;
});
