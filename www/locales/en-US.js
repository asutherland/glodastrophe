define(function(require) {

return {
  // --- Account Home
  accountHomeShow3Pane: '3-Pane View',
  accountHomeShowFolders: 'Folders',
  /** Delete the account permanently */
  deleteAccount: 'Delete Account',

  // --- Settings / Setup stuff
  /** Hyperlink text to navigate to the add an account page */
  settingsAccountAddLink: 'Add a new account…',

  // -- Card: autoconfig_setup.jsx
  /**
   * Header title for account setup via autoconfiguration given the display
   * name, email address, and password.
   */
  setupAutoconfigHeaderTitle: 'Add account',
  setupAutoconfigDisplayNamePlaceholder: 'Your name',
  setupAutoconfigEmailAddressPlaceholder: 'email@example.com',
  setupAutoconfigPasswordPlaceholder: 'password',
  /**
   * The button that actually starts the process of trying to automatically
   * configure the account.
   */
  setupAutoconfigTriggerAutoconfigButtonLabel: 'Add Account…',

  // -- folder_list.jsx
  refreshFolderList: 'Refresh folder list',

  // -- conversation list / sync stuff
  syncRefresh: 'Refresh',
  syncGrow: 'Grow',

  // --- Message Display

  // -- Message actions
  messageReply: 'Reply',

  // -- compose / drafts
  composeSend: 'Send',
  composeAttach: 'Attach',
  composeDiscard: 'Delete Draft',

  composeLabelTo: 'To:',
  composeLabelCc: 'Cc:',
  composeLabelBcc: 'Bcc:'
};

});
