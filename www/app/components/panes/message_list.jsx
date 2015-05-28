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
      view: null
    };
  },

  _getMessagesView: function(conversationId) {
    // If we're here
    if (this.state.view) {
      this.state.view.release();
    }

    if (!conversationId) {
      this.setState({
        error: null,
        view: null
      });
      return;
    }

    this.setState({
      view: this.props.mailApi.viewConversationMessages(conversationId)
    });
  },

  componentWillMount: function() {
    // XXX there needs to be some feedback path for viewConversationHeaders to
    // generate an error state because the conversation does not exist.
    this._getMessagesView(this.props.conversationId);
  },

  componentWillReceiveProps: function(nextProps) {
    this._getMessagesView(nextProps.conversationId);
  },

  componentWillUnmount: function() {
    if (this.state.view) {
      this.state.view.release();
    }
  },

  render: function() {
    // If there is no view, just be empty.
    if (!this.state.view) {
      return <div></div>;
    }

    if (this.state.error) {
      return <div>No SucH ConversatioN</div>;
    }

    // This auto-suppresses against spamming.
    this.state.view.ensureSnippets();

    return (
      <div className="message-list-pane">
        <h1>{this.props.conversationId}</h1>
        <button onClick={ this.ensureSnippets }>EnsurE SnippetS</button>
        <WindowedList
          view={ this.state.view }
          widget={ MessageSummary }
          pick={ this.props.pick }
          />
      </div>
    );
  },

  ensureSnippets: function() {
    this.state.view.ensureSnippets();
  }
});

return MessageListPane;
});
