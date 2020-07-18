import React from 'react';

import { Localized } from "@fluent/react";

/**
 * Reply button for a message.  In theory this could get fancy and provide magic
 * expanding support for reply all/reply list/forward/etc./etc.
 */
export default class MessageForward extends React.Component {
  render() {
    return (
      <button className="message-action-forward"
              onClick={ this.clickForward }>
        <Localized
          id='messageForward' />
      </button>
    );
  }

  clickForward(event) {
    event.stopPropagation();
    // Pass noComposer so that a MessageComposition is not automatically created
    // for us.  Because we
    this.props.item.forwardMessage('inline', { noComposer: true })
    .then(({ id }) => {
      this.props.navigateToDraft(id);
    });
  }
};
