define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var ViewSliceList = require('jsx!../view_slice_list');

var MessageSummary = require('jsx!../summaries/message');

var navigate = require('react-mini-router').navigate;

var MessageListPane = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      error: null,
      slice: null
    };
  },

  componentWillMount: function() {
    this.setState({
      slice: this.props.mailApi.viewConversationHeaders(
               this.props.conversationId)
    });
  },

  componentWillUnmount: function() {
    if (this.state.slice) {
      this.state.slice.release();
    }
  },

  render: function() {
    if (this.state.error) {
      return <div>No SucH ConversatioN</div>;
    }

    return (
      <div>
        <h1>{this.props.conversationId}</h1>
        <ViewSliceList
          slice={this.state.slice}
          widget={MessageSummary}
          />
      </div>
    );
  },
});

return MessageListPane;
});
