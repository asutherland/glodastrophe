import React from 'react';

import { Localized } from '@fluent/react';
import { FluentDateTime } from '@fluent/bundle';

import Star from '../actioners/star';
import Unread from '../actioners/unread';

/**
 * Hacked up version of the `ConversationSummary` for the purpose of displaying
 * messages on their own, outside the context of a conversation.  This is
 * intended to provide a workable way to display calendar events as mapped to
 * messages.
 *
 * A non-hacky approach to this would be to:
 * - Have a custom widget for message-as-event.
 * - Make sure that the back-end is able to express a data type on the message,
 *   potentially even providing a more domain-appropriate wrapper type (although
 *   for simplicity the wire rep types could still be using the mail_rep if it
 *   makes sense).
 */
const MessageStandalone = React.memo(function MessageStandalone(props) {
  const msg = props.item;

  var rootClasses = 'conv-summary';
  if (props.selected) {
    rootClasses += ' conv-summary-selected';
  }

  const peopleList = [msg.author].concat(msg.to);
  var peopleNames = peopleList.slice(0, 6).map(x => (x.name || x.address));

  function onClickMessage() {
    if (props.pick) {
      props.pick(msg.id);
    }
  }

  return (
    <div className={ rootClasses }
          onClick={ onClickMessage }
          >
      <div className="conv-summary-envelope-row">
        <Unread item={ msg } />
        <Star item={ msg } />
        <div className="conv-summary-date">
          <Localized id="convSummaryDate" vars={{ date: msg.date }}/>
        </div>
        <div className="conv-summary-subject">{ msg.subject }</div>
      </div>
      <div className="conv-summary-aggregates-row">
        <div className="conv-summary-authors">
          { peopleNames.join(', ') }
        </div>
      </div>
    </div>
  );
});

export default MessageStandalone;
