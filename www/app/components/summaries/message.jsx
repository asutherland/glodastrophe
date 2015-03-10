define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var MessageSummary = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    var msg = this.props.item;
    return (
      <div>
        <div>{ msg.author.name || msg.author.address }</div>
        <div>{ this.props.item.subject }</div>
        <hr/>
      </div>
    );
  }
});

return MessageSummary;
});
