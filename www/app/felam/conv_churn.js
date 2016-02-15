define(function() {
'use strict';

const { oldToNewConversationMessageComparator } = require('gelam/db/comparators');

/**
 * Churn up our application-specific summary stuff:
 * - A list of all messages in the conversation with index references to their
 *   parent (as we best understand it) for threading purposes.  (We could use
 *   direct references which survive structured clone transit, but will fail
 *   to JSON happily, and that makes us sad.)  We also include other attributes
 *   for a brief overview visualization of the conversation.
 *
 *
 */
return function churnConversation(convInfo, messages/*, oldConvInfo */) {
  // Ensure the messages are sorted oldest to newest.  We do this because for
  // simplicity for gaia mail's UX decisions we initially opted to do
  // NEW-TO-OLD.  A more rigorous treatment and rationale is needed, however.
  messages = messages.concat();
  messages.sort(oldToNewConversationMessageComparator);

  let tidbits = convInfo.app.tidbits = [];

  let midToIndex = new Map();
  let findClosestAncestor = (references) => {
    // We might not have references available.  This is the case for ActiveSync,
    // but it's also the case we don't have any useful threading in that case.
    if (!references) {
      return 0;
    }

    for (let i = references.length; i >= 0; i--) {
      let ref = references[i];
      if (midToIndex.has(ref)) {
        return midToIndex.get(ref);
      }
    }
    // If we couldn't find any, then assume that it's just a reply to the root.
    return 0;
  };

  for (let message of messages) {
    let isRead = message.flags.indexOf('\\Seen') !== -1;
    let isStarred = message.flags.indexOf('\\Flagged') !== -1;
    tidbits.push({
      id: message.id,
      date: message.date,
      isRead,
      isStarred,
      author: message.author,
      parent: findClosestAncestor(message.references)
    });
    midToIndex.set(message.guid, tidbits.length - 1);
  }

  if (tidbits.length === 1) {
    convInfo.height = 1;
  } else {
    convInfo.height = 2;
  }
};
});
