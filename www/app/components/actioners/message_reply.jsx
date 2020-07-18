import React from 'react';

import { Localized } from "@fluent/react";

/**
 * Reply button for a message.  In theory this could get fancy and provide magic
 * expanding support for reply all/reply list/forward/etc./etc.
 */
export default class MessageReply extends React.Component {
  render() {
    return (
      <button className="message-action-reply"
              onClick={ this.clickReply }>
        <Localized
          id='messageReply' />
      </button>
    );
  }

  clickReply(event) {
    event.stopPropagation();
    // Pass noComposer so that a MessageComposition is not automatically created
    // for us and instead
    this.props.item.replyToMessage('all', { noComposer: true });
  }
};
