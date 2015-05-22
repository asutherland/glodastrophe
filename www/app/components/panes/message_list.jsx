define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var WindowedList = require('jsx!../windowed_list');

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
    // XXX there needs to be some feedback path for viewConversationHeaders to
    // generate an error state because the conversation does not exist.
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

    // This auto-suppresses against spamming.
    this.state.slice.ensureSnippets();

    return (
      <div>
        <h1>{this.props.conversationId}</h1>
        <button onClick={ this.ensureSnippets }>EnsurE SnippetS</button>
        <WindowedList
          slice={this.state.slice}
          widget={MessageSummary}
          />
      </div>
    );
  },

  ensureSnippets: function() {
    this.state.slice.ensureSnippets();
  }
});

return MessageListPane;
});
