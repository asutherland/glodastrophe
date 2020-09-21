import React from 'react';
import PropTypes from 'prop-types';

import WholeWindowedList from '../whole_windowed_list';

import MessageSummary from '../summaries/message';
import DraftSummary from '../summaries/draft';

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
      <div>
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
}

MessageListPane.propTypes = {
  selectedMessageId: PropTypes.string,
  view: PropTypes.object,
  onNavigateToDraft: PropTypes.func.isRequired,
  onSelectMessageId: PropTypes.func.isRequired,
};
