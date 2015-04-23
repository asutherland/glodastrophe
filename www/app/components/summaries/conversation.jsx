define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var ConversationSummary = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    var msg = this.props.item;

    var tidbits = msg.messageTidbits.map(function(tidbit) {
      return (
        <div class="conv-tidbit">
          <div class="conv-tidbit-author">{ tidbit.author.name || tidbit.author.address }</div>
          <div class="conv-tidbit-snippet">{ tidbit.snippet }</div>
        </div>
      );
    });
    return (
      <div>
        <div>
          <div class="conv-date">
            <FormattedRelative value={msg.mostRecentMessageDate} />
          </div> : 
          <div class="conv-subject">{ msg.firstSubject }</div>
        </div>
        <div>{ tidbits }</div>
        <hr/>
      </div>
    );
  }
});

return ConversationSummary;
});
