define(function() {
'use strict';

/**
 * How many tidbits should we cram in a conversation summary?
 */
const MAX_TIDBITS = 3;

/**
 * Produce a conversationInfo summary given all of the currently existing
 * headers in the conversation ordered from oldest to newest.
 */
return function churnConversation(convInfo, messages/*, oldConvInfo */) {
  let tidbits = convInfo.app.tidbits = [];

  for (let message of messages) {
    let isRead = message.flags.indexOf('\\Seen') !== -1;

    // Add up to MAX_TIDBITS tidbits for unread messages
    if (!isRead) {
      let isStarred = message.flags.indexOf('\\Flagged') !== -1;
      tidbits.push({
        id: message.id,
        date: message.date,
        isRead: isRead,
        isStarred: isStarred,
        hasAttachments: message.hasAttachments,
        author: message.author,
        snippet: message.snippet
      });
      if (tidbits.length >= MAX_TIDBITS) {
        break;
      }
    }
  }

  convInfo.height = tidbits.length + 1;
};
});
