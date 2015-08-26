define(function (require) {
'use strict';

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var WholeWindowedList = require('jsx!../whole_windowed_list');

var MessageSummary = require('jsx!../summaries/message');
var DraftSummary = require('jsx!../summaries/draft');

var Taggy = require('jsx!../actioners/taggy');
var TagAdder = require('jsx!../actioners/tag_adder');

var navigate = require('react-mini-router').navigate;


/**
 * An expandable message list implementation.  Because we are a desktop client
 * and heights effectively cannot be pre-computed, we have to go for a fully
 * instantiated list.
 */
var MessageListPane = React.createClass({
  mixins: [IntlMixin, React.addons.PureRenderMixin],
  getInitialState: function() {
    return {
      error: null,
      conversation: null,
      view: null
    };
  },

  _getMessagesView: function(conversationId, why) {
    if (this.state.conversation) {
      this.state.conversation.release();
    }
    if (this.state.view) {
      console.log('releasing messages view because:', why);
      this.state.view.release();
    }

    if (!conversationId) {
      this.setState({
        error: null,
        conversation: null,
        view: null
      });
      return;
    }

    // clear so there's no state ambiguity during the async call.
    this.setState({
      conversation: null,
      view: null
    });
    this.props.mailApi.getConversation(conversationId).then((conversation) => {
      // Because getConversation is async, there could potentially be
      // multiple of these requests in flight.  Currently relative ordering
      // will not be guaranteed, so this is an insufficient state machine, but
      // at least this will not result in "leaks".
      if (this.state.conversation) {
        this.state.conversation.release();
      }
      if (this.state.view) {
        this.state.view.release();
      }
      // Needed for conversation details; those widgety things should probably
      // be pushed down into a summary widget that gets its serial bumped as a
      // prop.
      conversation.on('change', this.forceUpdate.bind(this, null));
      conversation.on('remove', this.props.conversationDeleted);
      this.setState({
        conversation: conversation,
        view: this.props.mailApi.viewConversationMessages(conversationId)
      });
    }, (err) => {
      console.error('got a rejection getting the conversation?', err);
      this.setState({
        error: true
      });
    });
  },

  componentWillMount: function() {
    // XXX there needs to be some feedback path for viewConversationHeaders to
    // generate an error state because the conversation does not exist.
    this._getMessagesView(this.props.conversationId, 'mount');
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.conversationId !== nextProps.conversationId) {
      this._getMessagesView(nextProps.conversationId, 'propchange');
    }
  },

  componentWillUnmount: function() {
    if (this.state.conversation) {
      this.state.conversation.release();
    }
    if (this.state.view) {
      this.state.view.release();
    }
  },

  _pickMessageWidget: function(item) {
    if (item.isDraft) {
      return DraftSummary;
    } else {
      return MessageSummary;
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

    var conv = this.state.conversation;

    return (
      <div className="message-list-pane">
        <h1 className="conv-header-subject">{ conv.firstSubject }</h1>
        <div className="conv-header-label-row">
          { conv.labels.map(folder => <Taggy key={ folder.id }
                                             labelOwner={ conv }
                                             folder={ folder } />) }
          <TagAdder key="adder"
            conversation={ conv }
            />
        </div>
        <button onClick={ this.ensureSnippets }>EnsurE SnippetS</button>
        <WholeWindowedList
          view={ this.state.view }
          conditionalWidget={ this._pickMessageWidget }
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
