define(function (require) {
'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');

const WholeWindowedList = require('../whole_windowed_list');

const MessageSummary = require('../summaries/message');
const DraftSummary = require('../summaries/draft');

/**
 * An expandable message list implementation.  Because we are a desktop client
 * and heights effectively cannot be pre-computed, we have to go for a fully
 * instantiated list.
 */
var MessageListPane = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    selectedMessageId: React.PropTypes.string,
    view: React.PropTypes.object,
    onNavigateToDraft: React.PropTypes.func.isRequired,
    onSelectMessageId: React.PropTypes.func.isRequired,
  },

  /**
   * Drafts get their own Widget type.
   */
  _pickMessageWidget: function(message) {
    if (message.isDraft) {
      return DraftSummary;
    } else {
      return MessageSummary;
    }
  },

  render: function() {
    const view = this.props.view;

    // If there is no view, just be empty.
    if (!view) {
      return <div></div>;
    }

    return (
      <div className="message-list-scroll-region">
        <WholeWindowedList
          view={ view }
          conditionalWidget={ this._pickMessageWidget }
          pick={ this.props.onSelectMessageId }
          navigateToDraft={ this.props.onNavigateToDraft }
          selectedId={ this.props.selectedMessageId }
          />
      </div>
    );
  }
});

return MessageListPane;
});
