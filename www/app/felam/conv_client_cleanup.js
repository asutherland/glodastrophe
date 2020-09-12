import ContactCache from 'gelam/clientapi/contact_cache';

/**
 * Clean up after what we did in "conv_client_decorator.js".
 */
export default function cleanupConversation(mailConversation) {
  let tidbitPeeps = mailConversation.messageTidbits.map(x => x.author);
  ContactCache.forgetPeepInstances(tidbitPeeps);
}
