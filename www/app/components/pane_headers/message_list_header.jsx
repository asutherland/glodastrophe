define(function (require) {
'use strict';

const React = require('react');

/*
const Toolbar = require('material-ui/lib/toolbar/toolbar');
const ToolbarGroup = require('material-ui/lib/toolbar/toolbar-group');
const ToolbarSeparator = require('material-ui/lib/toolbar/toolbar-separator');
const ToolbarTitle = require('material-ui/lib/toolbar/toolbar-title');

const IconButton = require('material-ui/lib/icon-button');
const FontIcon = require('material-ui/lib/font-icon');
*/

const Taggy = require('../actioners/taggy');
const TagAdder = require('../actioners/tag_adder');

/**
 * The header and interface for a list of messages.
 */
const MessageListHeader = React.createClass({
  propTypes: {
    conversation: React.PropTypes.object,
    conversationSerial: React.PropTypes.number,
  },

  getInitialState: function() {
    return {};
  },

  render: function() {
    const conv = this.props.conversation;

    if (!conv) {
      return <div></div>;
    }

    return (
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
      </div>
    );
  },

});

return MessageListHeader;
});
