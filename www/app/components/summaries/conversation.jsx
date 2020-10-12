import React from 'react';

import { Localized } from '@fluent/react';
import { FluentDateTime } from '@fluent/bundle';

import Star from '../actioners/star';
import Unread from '../actioners/unread';
import Drafts from '../actioners/drafts';

import PatchSummary from '../summaries/patch';

import ConvTimeThreadingVis from '../visualizations/conv_time_threading';
import ConvLogCalendar from '../visualizations/conv_log_calendar';

// item, pick, selected, serial
const ConversationSummary = React.memo(function ConversationSummary(props) {
  const conv = props.item;

  // XXX this was from the old quantized height magic, currently disabled.
  /*
  var height = 40 * conv.height;
  var inlineStyle = {
    height: height,
  };
  */

  var authorNames = conv.authors.slice(0, 6).map(x => (x.name || x.address));

  var rootClasses = 'conv-summary';
  if (props.selected) {
    rootClasses += ' conv-summary-selected';
  }

  function onClickConversation() {
    if (props.pick) {
      props.pick(conv.id);
    }
  }

  // How many horizontal pixels does our styling eat?  Right now I think this
  // is actually me effectively hardcoding the size of my scrollbar which is
  // very bad and very dumb and it raises questions about what the outer
  // sizing widget is actually measuring.
  var WIDTH_WASTE = 15;

  var maybeVis;
  if (conv.messageTidbits.length > 1) {
    /*
    maybeVis = (
      <ConvTimeThreadingVis
        key="vis"
        conv={conv}
        widthBudget={ 426 }
        />
    );
    */
   maybeVis = (
     <ConvLogCalendar
       data={conv.messageTidbits}
       />
   );
  }

  let maybeAppInfo;
  if (conv.convType === 'phab-drev') {
    if (conv.patchInfo) {
      maybeAppInfo = (
        <div className="phab-drev-summary">
          <h3>{ conv.drevInfo.status }</h3>
          <PatchSummary patchInfo={ conv.patchInfo } />
        </div>
      );
    }
  }

  // This allows us to provide some initial formatting guidance that the
  // localization can then override.  There currently does not appear to be any
  // Intl.RelativeTimeFormat magic in fluent.js, so we likely need to create
  // a custom widget (and perhaps contribute it back) if more logic is needed.
  const convSummaryDate = new FluentDateTime(conv.mostRecentMessageDate);

  return (
    <div className={ rootClasses }
          onClick={ onClickConversation }
          >
      <div className="conv-summary-envelope-row">
        <Unread {...props} item={ conv } />
        <Star {...props} item={ conv } />
        <div className="conv-summary-date">
          <Localized id="convSummaryDate" vars={{ date: convSummaryDate }}/>
        </div>
        <Drafts {...props} item={ conv } />
        <div className="conv-summary-subject">{ conv.firstSubject }</div>
      </div>
      <div className="conv-summary-aggregates-row">
        <div className="conv-summary-message-count">
          ({ conv.messageCount })&nbsp;
        </div>
        <div className="conv-summary-authors">
          { authorNames.join(', ') }
        </div>
      </div>
      <div className="conv-summary-details">
        { maybeVis }
        { maybeAppInfo }
      </div>
    </div>
  );
});

export default ConversationSummary;
