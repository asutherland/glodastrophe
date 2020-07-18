import React from 'react';
import PropTypes from 'prop-types';

import Taggy from '../actioners/taggy';
import TagAdder from '../actioners/tag_adder';

/**
 * The header and interface for a list of messages.
 */
export default class MessageListHeader extends React.Component {
  getInitialState() {
    return {};
  }

  render() {
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
  }
};

MessageListHeader.propTypes = {
  conversation: React.PropTypes.object,
  conversationSerial: React.PropTypes.number,
};
