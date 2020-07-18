import React from 'react';
import PropTypes from 'prop-types';

const WholeWindowedList = require('../whole_windowed_list');

const MessageSummary = require('../summaries/message');
const DraftSummary = require('../summaries/draft');

/**
 * An expandable message list implementation.  Because we are a desktop client
 * and heights effectively cannot be pre-computed, we have to go for a fully
 * instantiated list.
 */
export default class MessageListPane extends React.PureComponent {
  /**
   * Drafts get their own Widget type.
   */
  _pickMessageWidget(message) {
    if (message.isDraft) {
      return DraftSummary;
    } else {
      return MessageSummary;
    }
  }

  render() {
    const view = this.props.view;

    // If there is no view, just be empty.
    if (!view) {
      return <div></div>;
    }

    const passProps = {
      navigateToDraft: this.props.onNavigateToDraft
    };

    return (
      <div className="message-list-scroll-region">
        <WholeWindowedList
          view={ view }
          conditionalWidget={ this._pickMessageWidget }
          passProps={ passProps }
          pick={ this.props.onSelectMessageId }
          selectedId={ this.props.selectedMessageId }
          />
      </div>
    );
  }
};

MessageListPane.propTypes = {
  selectedMessageId: PropTypes.string,
  view: PropTypes.object,
  onNavigateToDraft: PropTypes.func.isRequired,
  onSelectMessageId: PropTypes.func.isRequired,
};
