define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;
var FormattedRelative = require('react-intl').FormattedRelative;

var ConversationSummary = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    var msg = this.props.item;

    var tidbits = msg.messageTidbits.map(function(tidbit) {
      return (
        <div className="conv-tidbit">
          <div className="conv-tidbit-author">{ tidbit.author.name || tidbit.author.address }</div>
          <div className="conv-tidbit-date">
            <FormattedRelative value={tidbit.date} />
          </div>
          <div className="conv-tidbit-snippet">{ tidbit.snippet }</div>
        </div>
      );
    });
    return (
      <div className="conv-summary">
        <div>
          <div className="conv-summary-date">
            <FormattedRelative value={msg.mostRecentMessageDate} />
          </div>
          <div className="conv-summary-subject">{ msg.firstSubject }</div>
        </div>
        <div className="conv-summary-tidbits">{ tidbits }</div>
      </div>
    );
  }
});

return ConversationSummary;
});
