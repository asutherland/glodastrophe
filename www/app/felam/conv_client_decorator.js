define(function(require) {
'use strict';

const ContactCache = require('gelam/clientapi/contact_cache');

const cleanupConversation = require('./conv_client_cleanup');

/**
 * Put stuff that our "conv_churn.js" created onto the MailConversation
 * instance.  Cleanup happens in "conv_client_cleanup.js".
 */
return function decorateConversation(mailConversation, wireRep, firstTime) {
  // Delta-computing peeps is hard, forget them all then re-resolve them all.
  // We have a cache.  It's fine.
  if (!firstTime) {
    cleanupConversation(mailConversation);
  }

  mailConversation.messageTidbits = wireRep.app.tidbits.map((tidbit) => {
    return {
      date: new Date(tidbit.date),
      isRead: tidbit.isRead,
      isStarred: tidbit.isStarred,
      hasAttachments: tidbit.hasAttachments,
      author: ContactCache.resolvePeep(tidbit.author),
      snippet: tidbit.snippet
    };
  });
};
});
