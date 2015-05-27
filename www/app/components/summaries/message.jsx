define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;
var FormattedRelative = require('react-intl').FormattedRelative;

var navigate = require('react-mini-router').navigate;

var MessageSummary = React.createClass({
  mixins: [IntlMixin],

  defaultProps: {
  },

  render: function() {
    var msg = this.props.item;
    return (
      // XXX we can't use an 'a' link because BAD things happen if multiple
      // tabs with us inside get opened.  Need SharedWorkers!
      <div className="message-item" onClick={ this.clickMessage }>
        <div className="message-envelope">
          <div className="message-author">
            { msg.author.name || msg.author.address }
          </div>
          <div className="message-date">
            <FormattedRelative value={msg.date} />
          </div>
        </div>
        <div className="message-subject">{ msg.subject }</div>
        <div className="message-snippet">{ msg.snippet || '' }</div>
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
