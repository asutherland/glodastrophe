define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;
var FormattedRelative = require('react-intl').FormattedRelative;

var navigate = require('react-mini-router').navigate;

var SliceItemMixin = require('../slice_item_mixin');

var ConversationSummary = React.createClass({
  mixins: [IntlMixin, SliceItemMixin],

  render: function() {
    var conv = this.props.item;

    var tidbits = conv.messageTidbits.map(function(tidbit) {
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
    var height = 20 * conv.height;
    var inlineStyle = {
      height: height,
    };
    return (
      <div className="conv-summary" onClick={ this.showConversation }
           style={ inlineStyle } >
        <div>
          <div className="conv-summary-date">
            <FormattedRelative value={ conv.mostRecentMessageDate } />
          </div>
          <div className="conv-summary-subject">{ conv.firstSubject }</div>
        </div>
        <div className="conv-summary-tidbits">{ tidbits }</div>
      </div>
    );
  },

  showConversation: function() {
    navigate('/view/conversation/' + this.props.item.id);
  }
});

return ConversationSummary;
});
