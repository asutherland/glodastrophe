define(function (require) {
'use strict';

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var localeMessages = require('locales/en-US');

var RouterMixin = require('react-mini-router').RouterMixin;

var mailApi = require('gelam/main-frame-setup');

// -- Pages
var Home = require('jsx!./components/home/home');

var AutoconfigSetup = require('jsx!./components/accounts/autoconfig_setup');
// - Views
var FolderListPane = require('jsx!./components/panes/folder_list');
var ConversationListPane = require('jsx!./components/panes/conversation_list');

var queryString = require('./query_string');

var App = React.createClass({
  mixins: [RouterMixin, IntlMixin],

  routes: {
    '/': 'home',
    // Setting stuff
    '/settings': 'settings',
    '/settings/accounts/add': 'accountAdd',
    '/settings/accounts/:accountId': 'accountSettings',
    '/view/folders/:accountId': 'viewAccountFolders',
    '/view/folder/:folderId': 'viewFolder',
    '/view/folder/:folderId/message/:messageId': 'viewMessage'
  },

  render: function() {
    return this.renderCurrentRoute();
  },

  home: function() {
    return (
      <Home mailApi={mailApi} />
    );
  },

  settings: function() {
    return <div>Settings</div>;
  },

  accountSettings: function(accountId) {
    return <div>Account {accountId} Settings</div>;
  },

  accountAdd: function() {
    return (
      <AutoconfigSetup mailApi={mailApi} />
    );
  },

  viewAccountFolders: function(accountId) {
    return <FolderListPane mailApi={mailApi} accountId={accountId} />
  },

  viewFolder: function(folderId) {
    return <ConversationListPane mailApi={mailApi} folderId={folderId} />;
  },

  viewMessage: function(messageId) {
    return <div>View message {messageId}</div>;
  },

  notFound: function(path) {
    return <div class="not-found">Page Not Found: {path}</div>;
  }
});

React.render(
  <App locales={['en-US']} messages={ localeMessages } />,
  document.getElementById('content')
);

});
