define(function (require) {
'use strict';

var React = require('react');

var FormattedMessage = require('react-intl').FormattedMessage;

/**
 * Render an indicator that shows when a conversation has drafts in it.  It
 * will also (someday) jump to the draft when clicked.
 */
var drafts = React.createClass({
  render: function() {
    var item = this.props.item;
    var classes = 'drafts-widget ' +
      (item.hasDrafts ? 'drafts-widget-drafts' : 'drafts-widget-no-drafts');

    return (
      <span className={ classes } onClick={ this.jumpToFirstDraft }>
        <FormattedMessage
          id='convHasDrafts' />
      </span>
    );
  },

  jumpToFirstDraft: function() {
    // XXX uh, figure out how to do this.  I guess we could have a magic id that
    // the MessageList could take as a command to seek and then update its
    // location in place.  Alternately the MailConversation could know or we
    // could ourselves first look up the conversation to find the id then
    // immediately release it.  The seek-as-part-of-the-URL thing seems best
    // though.
  }
});

return drafts;
});
