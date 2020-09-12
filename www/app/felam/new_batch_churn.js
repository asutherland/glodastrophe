/**
 * ## Pre-convoy notifications used ##
 *
 * Here are the various permutations of notifications we generated pre-convoy.
 * This really only matters as I port things, but maybe you will find this
 * interesting in the future right until you delete it?  But it will be too
 * late, I was already paid by the word.
 *
 * ### More than one new message ###
 * #### Only one account defined ####
 *     {{ n }} New Emails
 *     FromAddress1, FromAddress2, FromAddress3
 * #### Multiple accounts defined ####
 *     {{ n }} New Emails ({{ accountName }})
 *     FromAddress1, FromAddress2, FromAddress3
 * ### Only one new message ###
 * #### Only one account defined ####
 *     MessageSubject
 *     FromAddress
 * #### Multiple accounts defined ####
 *     1 New Email ({{ accountName }})
 *     MessageSubject
 */

/**
 * The new structure groups by conversation because that's the most
 * forward-looking strategy, but the current logic still just cares about
 * messages.  So we flatten things into just a big soup of messages sorted from
 * newest to oldest.
 */
function flattenConvHierarchyToMessagesNewestFirst(newByConv) {
  let messages = [];

  for (let messageMap of newByConv.values()) {
    for (let message of messageMap.values()) {
      messages.push(message);
    }
  }
  messages.sort((a, b) => b.date - a.date);
  return messages;
}

/**
 * Do our per-account process.  (We only care about things on an account
 * granularity because of our explicit UX decision to limit notifications to
 * one per account.)
 *
 * Our return value takes on one of the following forms:
 * - null: no new messages!
 * - { newMessageCount: 1, fromAddress, subject, accountName? }
 * - { newMessageCount: >1, topFromAddresses, accountName? }
 *
 * We currently ignore that conversations exist, but at some point the
 * notifications should get revamped and and then we'll totes leverage the
 * structure.
 */
function churnPerAccount(multipleAccounts, accountInfo, newByConv) {
  if (newByConv.size === 0) {
    return null;
  }

  let messages = flattenConvHierarchyToMessagesNewestFirst(newByConv);

  // We only provide the account name if there are multiple accounts.
  let maybeAccountName = multipleAccounts ? accountInfo.name : null;

  if (messages.length === 1) {
    let message = messages[0];
    return {
      newMessageCount: 1,
      fromAddress: message.authorNameish,
      subject: message.subject,
      maybeAccountName
    };
  }

  let uniqueAddresses = [];
  let maxCount = 3;

  for (let message of messages) {
    let candidateAddress = message.authorNameish;
    if (uniqueAddresses.indexOf(candidateAddress) === -1) {
      uniqueAddresses.push(candidateAddress);
      if (uniqueAddresses.length >= maxCount) {
        break;
      }
    }
  }

  return {
    newMessageCount: messages.length,
    topFromAddresses: uniqueAddresses,
    maybeAccountName
  };
}

/**
 * Process all current new-sets to provide an updated set of per-account
 * notifications that will be sent to the front-end.  We *are* the application
 * logic deciding and summarizing what gets shown.
 *
 * The front-end's responsibility is limited to notification-API and l10n
 * ramifications, which are these:
 * - It determines if we still have an actively displayed notification for the
 *   account.  It uses this to handle notification retraction if there are no
 *   longer any new messages.  If there are new messages, it uses the existing
 *   notification to know to perform a silent update (which requires us to jump
 *   through special hoops.)
 * - It figures out what l10n string id's to use for the notification type we
 *   decide on.  This includes compensating for whether multiple accounts are
 *   known to the system or not.  (This impacts whether we include the account
 *   "name" in the notification to disambiguate.)
 *
 *
 */
export default function churnAllNewMessages(ctx, newSetsWithAccount) {
  let perAccountResults = new Map();

  for (let { accountInfo, newByConv } of newSetsWithAccount) {
    perAccountResults.set(
      accountInfo.id,
      churnPerAccount(!!newSetsWithAccount.length, accountInfo, newByConv));
  }

  return Promise.resolve(perAccountResults);
}

