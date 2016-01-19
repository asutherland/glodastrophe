define(function (require) {
'use strict';

var React = window.React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;
var localeMessages = require('locales/en-US');

var RouterMixin = require('react-mini-router').RouterMixin;
var navigate = require('react-mini-router').navigate;

// expose the mailApi to the window for debugging.  I'm struggling to introspect
// react.js bindings without formal devtool support, and this way at least
// should reslt in reusable JS console snippets.
var mailApi = window.mailApi = require('gelam/main-frame-setup');

// -- Pages
var Home = require('jsx!./components/home/home');

var AutoconfigSetup = require('jsx!./components/accounts/autoconfig_setup');
// - Views
var FolderListPane = require('jsx!./components/panes/folder_list');
var ConversationListPane = require('jsx!./components/panes/conversation_list');
var MessageListPane = require('jsx!./components/panes/message_list');
// - Debug Views
var DebugCronsync = require('jsx!./components/debuggy/debug_cronsync');

var SplitPane = require('react-split-pane');

var { accountIdFromMessageId, convIdFromMessageId } =
  require('gelam/id_conversions');

var App = React.createClass({
  mixins: [RouterMixin, IntlMixin],

  routes: {
    '/': 'home',
    // Setting stuff
    '/settings': 'settings',
    '/settings/accounts/add': 'accountAdd',
    '/settings/accounts/:accountId': 'accountSettings',
    // - Single one-off views.
    '/view/folders/:accountId': 'viewAccountFolders',
    '/view/folder/:folderId': 'viewFolder',
    '/view/conversation/:conversationId': 'viewConversation',
    '/view/message/:messageId': 'viewMessage',
    // - Composite views.
    '/view/3col/:accountId/:folderId/:conversationId': 'view3Col',
    // - Debuggy views
    '/debug/cronsync': 'debugCronsync'
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
    var navigateToFolder = function(folder) {
      navigate('/view/folder/' + folder.id);
    };

    return (
      <FolderListPane
        mailApi={mailApi}
        accountId={accountId}
        pick={ navigateToFolder }
        />
    );
  },

  viewFolder: function(folderId) {
    var navigateToConv = function(conv) {
      navigate('/view/conversation/' + conv.id);
    };

    return (
      <ConversationListPane
        mailApi={ mailApi }
        folderId={ folderId }
        pick={ navigateToConv }
        />
    );
  },

  viewConversation: function(conversationId) {
    var navigateToMessage = function(message) {
      navigate('/view/message/' + message.id);
    };

    return (
      <MessageListPane
        mailApi={ mailApi }
        conversationId={ conversationId }
        pick={ navigateToMessage }
        />
    );
  },

  view3Col: function(accountId, folderId, conversationId) {
    console.log('3col', [accountId, folderId, conversationId]);

    var navigateHome = function() {
      navigate('/');
    };
    var navigateToFolder = function(folder) {
      navigate('/view/3col/' + accountId + '/' + folder.id + '/.');
    };
    var navigateToConv = function(conv) {
      navigate('/view/3col/' + accountId + '/' + folderId + '/' + conv.id);
    };
    var navigateToDraft = function(messageId) {
      var navAccountId = accountIdFromMessageId(messageId);
      var convId = convIdFromMessageId(messageId);
      // Find the localdrafts folder
      var account = mailApi.accounts.getAccountById(navAccountId);
      var folder = account.folders.getFirstFolderWithType('localdrafts');
      navigate('/view/3col/' + accountId + '/' + folder.id + '/' + convId);
    };

    // The route doesn't match without placeholders, so normalize period as a
    // placeholder that becomes null and which the panes know how to handle.
    if (folderId === '.') {
      folderId = null;
    }
    if (conversationId === '.') {
      conversationId = null;
    }

    // If the conversation gets deleted, the reasonable things to do are:
    // - end up with nothing selected
    // - select something else.
    // We currently pick selecting nothing.
    var conversationDeleted = () => {
      navigate('/view/3col/' + accountId + '/' + folderId + '/.');
    };

    let restore = name => localStorage.getItem(name);
    let save = function(name) {
      return (size) => { localStorage.setItem(name, size); };
    };

    return (
      <div>
        <SplitPane split="vertical"
                   defaultSize={ restore('3col:split1') }
                   onChange={ save('3col:split1') }>
          <div>
            <div onClick={ navigateHome }>
              <FormattedMessage
                message={ this.getIntlMessage('home') } />
            </div>
            <FolderListPane
              mailApi={ mailApi }
              accountId={ accountId }
              pick={ navigateToFolder }
              selectedId={ folderId }
              />
          </div>
          <SplitPane split="vertical"
                     defaultSize={ restore('3col:split2') }
                     onChange={ save('3col:split2') }>
            <ConversationListPane
              mailApi={ mailApi }
              folderId={ folderId }
              selectedId={ conversationId }
              pick={ navigateToConv }
              navigateToDraft={ navigateToDraft }
              />
            <MessageListPane
              mailApi={ mailApi }
              conversationId={ conversationId }
              conversationDeleted = { conversationDeleted }
              navigateToDraft={ navigateToDraft }
              />
          </SplitPane>
        </SplitPane>
      </div>
    );
  },

  viewMessage: function(messageId) {
    return <div>View message {messageId}</div>;
  },

  debugCronsync: function() {
    return (
      <div>
        <DebugCronsync
          mailApi={ mailApi }
          />
      </div>
    );
  },

  notFound: function(path) {
    return <div className="not-found">Page Not Found: {path}</div>;
  }
});

React.render(
  <App locales={['en-US']} messages={ localeMessages } />,
  document.getElementById('content')
);
});
