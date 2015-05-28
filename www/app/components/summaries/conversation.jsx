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

    var tidbits = conv.messageTidbits.map(function(tidbit, iTidbit) {
      return (
        <div className="conv-tidbit" key={ iTidbit }>
          <div className="conv-tidbit-envelope-row">
            <div className="conv-tidbit-date">
              <FormattedRelative value={tidbit.date} />
            </div>
            <div className="conv-tidbit-author">{ tidbit.author.name || tidbit.author.address }</div>
          </div>
          <div className="conv-tidbit-snippet">{ tidbit.snippet }</div>
        </div>
      );
    });
    var height = 40 * conv.height;
    var inlineStyle = {
      height: height,
    };

    var authorNames = conv.authors.slice(0, 3).map(x => (x.name || x.address));

    return (
      <div className="conv-summary" onClick={ this.clickConversation }
           style={ inlineStyle } >
        <div className="conv-summary-envelope-row">
          <div className="conv-summary-date">
            <FormattedRelative value={ conv.mostRecentMessageDate } />
          </div>
          <div className="conv-summary-subject">{ conv.firstSubject }</div>
        </div>
        <div className="conv-summary-aggregates-row">
          <div className="conv-summary-message-count">
            ({ conv.messageCount })
          </div>
          <div className="conv-summary-authors">
            { authorNames.join(',') }
          </div>
        </div>
        <div className="conv-summary-tidbits">{ tidbits }</div>
      </div>
    );
  },

  clickConversation: function() {
    if (this.props.pick) {
      this.props.pick(this.props.item);
    }
  }
});

return ConversationSummary;
});
