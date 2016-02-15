define(function (require) {
'use strict';

var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var WholeWindowedList = require('../whole_windowed_list');

var ConvFilterBar = require('../filter_bar/conv_filter_bar');

var MessageSummary = require('../summaries/message');
var DraftSummary = require('../summaries/draft');

var Taggy = require('../actioners/taggy');
var TagAdder = require('../actioners/tag_adder');


/**
 * An expandable message list implementation.  Because we are a desktop client
 * and heights effectively cannot be pre-computed, we have to go for a fully
 * instantiated list.
 */
var MessageListPane = React.createClass({
  mixins: [PureRenderMixin],
  getInitialState: function() {
    return {
      error: null,
      conversation: null,
      view: null,
      filter: null
    };
  },

  _getMessagesView: function(conversationId, filter, why) {
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
      let view;
      if (!filter) {
        view = this.props.mailApi.viewConversationMessages(conversationId);
      } else {
        view = this.props.mailApi.searchConversationMessages({
          conversation,
          filter
        });
      }
      this.setState({
        conversation,
        view
      });
    }, (err) => {
      console.error('got a rejection getting the conversation?', err);
      this.setState({
        error: true
      });
    });
  },

  componentDidMount: function() {
    // XXX there needs to be some feedback path for viewConversationHeaders to
    // generate an error state because the conversation does not exist.
    this._getMessagesView(
      this.props.conversationId, null, 'mount');
  },

  componentWillUpdate: function(nextProps, nextState) {
    if (this.props.conversationId !== nextProps.conversationId ||
        this.state.filter !== nextState.filter) {
      // XXX this calls setState so this is the worst.  We need to address the
      // state management badly now.  Same in conversation_list.
      window.setTimeout(() => {
        this._getMessagesView(
          nextProps.conversationId, nextState.filter, 'update');
      }, 0);
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

  applyFilter: function(filter) {
    this.setState({
      filter
    });
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
        <div className="message-list-header">
          <h1 className="conv-header-subject">{ conv.firstSubject }</h1>
          <div className="conv-header-label-row">
            { conv.labels.map(folder => <Taggy key={ folder.id }
                                               labelOwner={ conv }
                                               folder={ folder } />) }
            <TagAdder key="adder"
              conversation={ conv }
              />
          </div>
          <div className="conv-header-actions">
            <button onClick={ this.ensureSnippets }>EnsurE SnippetS</button>
          </div>
          <ConvFilterBar key="cfb"
            initialFilter={ this.state.filter }
            applyFilter={ this.applyFilter }
            />
        </div>
        <div className="message-list-scroll-region">
          <WholeWindowedList
            view={ this.state.view }
            conditionalWidget={ this._pickMessageWidget }
            pick={ this.props.pick }
            navigateToDraft={ this.props.navigateToDraft }
            />
        </div>
      </div>
    );
  },

  ensureSnippets: function() {
    this.state.view.ensureSnippets();
  }
});

return MessageListPane;
});
