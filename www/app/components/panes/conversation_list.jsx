import React from 'react';
import PropTypes from 'prop-types';

import WindowedList from '../windowed_list';

import ConversationSummary from '../summaries/conversation';

/**
 * Display the list of conversations in a folder/whatever with a summary at the
 * top.
 */
export default class ConversationListPane extends React.PureComponent {
  render() {
    const view = this.props.view;

    // Be empty if there's no view.
    if (!view) {
      return <div></div>;
    }

    return (
      <div className="conversation-list-scroll-region">
        <WindowedList
          unitSize={ 40 }
          view={ view }
          widget={ ConversationSummary }
          selectedId={ this.props.selectedConversationId }
          pick={ this.props.onSelectConversationId }
          />
      </div>
    );
  }
};

ConversationListPane.propTypes = {
  selectedConversationId: PropTypes.string,
  view: PropTypes.object,
  onSelectConversationId: PropTypes.func.isRequired,
};