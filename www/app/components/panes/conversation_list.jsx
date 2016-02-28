define(function (require) {
'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');

const WindowedList = require('../windowed_list');

const ConversationSummary = require('../summaries/conversation');


/**
 * Display the list of conversations in a folder/whatever with a summary at the
 * top.
 */
var ConversationListPane = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    selectedConversationId: React.PropTypes.string,
    view: React.PropTypes.object,
    onSelectConversationId: React.PropTypes.func.isRequired,
  },

  render: function() {
    const view = this.props.view;

    // Be empty if there's no view.
    if (!view) {
      return <div></div>;
    }

    return (
      <div className="conversation-list-scroll-region">
        <WindowedList
          unitSize={ 40 }
          view={ view }
          widget={ ConversationSummary }
          selectedId={ this.props.selectedConversationId }
          pick={ this.props.onSelectConversationId }
          />
      </div>
    );
  },
});

return ConversationListPane;
});
