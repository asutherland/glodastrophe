import React from 'react';
import PropTypes from 'prop-types';

//import WindowedList from '../windowed_list';

import ConversationSummary from '../summaries/conversation';
import WholeWindowedList from '../whole_windowed_list';

/**
 * Display the list of conversations in a folder/whatever with a summary at the
 * top.
 *
 * XXX This is meant to be handled using a fancy quantized virtual list, but the
 * scroll logic is currently not happy.  This is probably down to styling /
 * measuring inconsistencies and incorrect constants thanks to the framework
 * change.  But it's also the case that our immediate goal is experimentation in
 * display, and this virtual list does assume a rather rigid quantized height
 * setup that we don't need yet.
 */
export default class ConversationListPane extends React.PureComponent {
  render() {
    const view = this.props.view;

    // Be empty if there's no view.
    if (!view) {
      return <div></div>;
    }

    // XXX the WholeWindowedList used to be a WindowedList with a unitsize={40}
    // that seemed to be wrong.
    return (
      <div className="conversation-list-scroll-region">
        <WholeWindowedList
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