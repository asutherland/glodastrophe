import ContactCache from 'gelam/clientapi/contact_cache';

import cleanupConversation from './conv_client_cleanup';

/**
 * Put stuff that our "conv_churn.js" created onto the MailConversation
 * instance.  Cleanup happens in "conv_client_cleanup.js".
 */
export default function decorateConversation(mailConversation, wireRep, firstTime) {
  // Delta-computing peeps is hard, forget them all then re-resolve them all.
  // We have a cache.  It's fine.
  if (!firstTime) {
    cleanupConversation(mailConversation);
  }

  mailConversation.messageTidbits = wireRep.app.tidbits.map((tidbit) => {
    return {
      id: tidbit.id,
      date: new Date(tidbit.date),
      isRead: tidbit.isRead,
      isStarred: tidbit.isStarred,
      author: ContactCache.resolvePeep(tidbit.author),
      parentIndex: tidbit.parent
    };
  });

  if (wireRep.app.patchInfo) {
    mailConversation.drevInfo = wireRep.app.drevInfo;
    mailConversation.patchInfo = wireRep.app.patchInfo;
  }
}
