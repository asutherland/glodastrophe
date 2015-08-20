define(function(require) {
'use strict';

const ContactCache = require('gelam/clientapi/contact_cache');

/**
 * Clean up after what we did in "conv_client_decorator.js".
 */
return function cleanupConversation(mailConversation) {
  let tidbitPeeps = mailConversation.messageTidbits.map(x => x.author);
  ContactCache.forgetPeepInstances(tidbitPeeps);
};
});
