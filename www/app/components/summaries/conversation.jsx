define(function (require) {
'use strict';

var React = require('react');

var FormattedRelative = require('react-intl').FormattedRelative;

var SliceItemMixin = require('../slice_item_mixin');

var Star = require('../actioners/star');
var Unread = require('../actioners/unread');
var Drafts = require('../actioners/drafts');

//var ConvTimeThreadingVis = require('../visualizations/conv_time_threading');

var ConversationSummary = React.createClass({
  mixins: [SliceItemMixin],

  render: function() {
    var conv = this.props.item;

    var height = 40 * conv.height;
    var inlineStyle = {
      height: height,
    };

    var authorNames = conv.authors.slice(0, 6).map(x => (x.name || x.address));

    var rootClasses = 'conv-summary';
    if (this.props.selected) {
      rootClasses += ' conv-summary-selected';
    }

    // How many horizontal pixels does our styling eat?  Right now I think this
    // is actually me effectively hardcoding the size of my scrollbar which is
    // very bad and very dumb and it raises questions about what the outer
    // sizing widget is actually measuring.
    var WIDTH_WASTE = 15;

    var maybeVis;
    if (conv.messageTidbits.length > 1) {
      /*
      maybeVis = (
        <ConvTimeThreadingVis
          key="vis"
          conv={conv}
          widthBudget={ this.props.widthBudget - WIDTH_WASTE }
          />
      );
      */
    }

    return (
      <div className={ rootClasses }
           onClick={ this.clickConversation }
           style={ inlineStyle } >
        <div className="conv-summary-envelope-row">
          <Unread {...this.props} item={ conv } />
          <Star {...this.props} item={ conv } />
          <div className="conv-summary-date">
            <FormattedRelative value={ conv.mostRecentMessageDate } />
          </div>
          <Drafts {...this.props} item={ conv } />
          <div className="conv-summary-subject">{ conv.firstSubject }</div>
        </div>
        <div className="conv-summary-aggregates-row">
          <div className="conv-summary-message-count">
            ({ conv.messageCount })&nbsp;
          </div>
          <div className="conv-summary-authors">
            { authorNames.join(', ') }
          </div>
        </div>
        { maybeVis }
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
