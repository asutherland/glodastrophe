import { SELECT_ACCOUNT, SELECT_FOLDER, SELECT_CONVERSATION, SELECT_MESSAGE,
        NAVIGATE_TO_DRAFT,
        MODIFY_TEXT_FILTER, MODIFY_FILTER, ADD_VIS, MODIFY_VIS, REMOVE_VIS }
  from './actionTypes';

import mailApi  from 'gelam/main-frame-setup';
import { convIdFromMessageId } from 'gelam/shared/id_conversions';

/**
 * Select an account and its inbox (or other specified folder type) for
 * display. If you know the folder you want specifically, use selectFolder
 * instead.
 */
export function selectAccountId(accountId, folderType) {
  return {
    type: SELECT_ACCOUNT,
    accountId,
    folderType: folderType || 'inbox'
  };
};

/**
 * Select the default account and its inbox.
 *
 * Currently it's assumed this is invoked after the `accountsLoaded` event
 * has been emitted by the MailAPI, but we can change this so this method
 * internally does that waiting itself.
 */
export function selectDefaultAccount() {
  if (mailApi.accounts.items.length === 0) {
    return { type: 'NOP' };
  }
  const account = mailApi.accounts.defaultAccount;
  return {
    type: SELECT_ACCOUNT,
    accountId: account.id,
    folderType: 'inbox'
  };
};

/**
 * Select a specific folder and the account that contains it for display.
 * This will cause us to change the conversationsView to this folder with
 * whatever the active filter is.
 */
export function selectFolderId(folderId) {
  return {
    type: SELECT_FOLDER,
    folderId
  };
};

/**
 * Select a conversation for display.  This does not impact the selected
 * account or folder or the contents of the conversations list other than
 * updating the conversationId which should be used for styling the given
 * conversation as selected.  This will update the `conversation`
 */
export function selectConversationId(conversationId) {
  return (dispatch) => {
    // We need to go asynchronous because we want the conversation to be a
    // live, tracked item, not something that transiently exists because of the
    // scroll position.  This is the only thing we do this for because accounts
    // and folders are eternal and synchronously available.
    return mailApi.getConversation(conversationId).then(
      (liveConversation) => {
        dispatch({
          type: SELECT_CONVERSATION,
          conversation: liveConversation
        });
      });
  };
};

export function selectMessageId(messageId) {
  return {
    type: SELECT_MESSAGE,
    messageId: messageId
  };
};

/**
 * Switch to the localdrafts folder and owning account that the given draft
 * lives in, selecting its conversation and message.  This is intended for use
 * when a fresh compose/forward is occurring.  (Because in that case the new
 * message will only exist in the (local)drafts folder.  Only replies get
 * placed with their conversation.)
 *
 * We probably could generalize this a little to be navigation to a message,
 * but it's worth better understanding the UX case a bit more before we do
 * that.  Right now the most obvious thing would be opening a message found
 * via search in its folder context.  But that gets complex in a gmail-like
 * model where the message and conversation could exist in multiple folders
 * concurrently.
 */
export function navigateToDraft(draftMessageId) {
  return (dispatch) => {
    let conversationId = convIdFromMessageId(draftMessageId);
    return mailApi.getConversation(conversationId).then(
      (liveConversation) => {
        dispatch({
          type: NAVIGATE_TO_DRAFT,
          conversation: liveConversation,
          draftMessageId
        });
      });
  };
};

/**
 * Modify the text filter configuration.  The text filter is our simplified
 * representation for quick-filter idiom purposes and differs from the actual
 * filter consumed by the back-end.
 */
export function modifyTextFilter(textFilterSpec) {
  return {
    type: MODIFY_TEXT_FILTER,
    textFilterSpec
  };
};

/**
 * Modify non-text-filter stuff.  Keys with null values get removed from the
 * current filter spec, keys with non-null values get added to the spec.  If
 * you want to clear the filter you s
 */
export function modifyFilter(filterSpecChanges) {
  return {
    type: MODIFY_FILTER,
    filterSpecChanges
  };
};

export function addVisualization(slot, visDef) {
  return {
    type: ADD_VIS,
    slot,
    visDef
  };
};

export function modifyVisualization(slot, visId, visDef) {
  return {
    type: MODIFY_VIS,
    slot,
    visId,
    visDef
  };
};

export function removeVisualization(slot, visId) {
  return {
    type: REMOVE_VIS,
    slot,
    visId
  };
;}

