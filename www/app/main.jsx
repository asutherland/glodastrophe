define(function (require) {
'use strict';

const React = window.React = require('react');
const ReactDOM = window.ReactDOM = require('react-dom');

const { IntlProvider } = require('react-intl');
const { Router, Route, IndexRoute, hashHistory } = require('react-router');
const { Provider, createStore, applyMiddleware } = require('react-redux');
const { thunk } = require('redux-thunk');

const localeMessages = require('locales/en-US');

// Make sure the backend spins up no matter what and provide a convenient way to
// get at it in the developer console.
window.mailApi = require('gelam/main-frame-setup');

// -- Pages
var Home = require('./components/home/home');

var AutoconfigSetup = require('./components/accounts/autoconfig_setup');

const ThreeCol = require('./components/pages/three_col');
const SidebarMenu = require('./components/pages/sidebar_menu');

// - Debug Views
var DebugCronsync = require('./components/debuggy/debug_cronsync');


var { accountIdFromMessageId, convIdFromMessageId } =
  require('gelam/id_conversions');

var App = React.createClass({
  render: function() {
    return this.props.children;
  }
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

/* Original route plans:
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
 */

window.addEventListener('load', () => {
  ReactDOM.render(
    <Provider store={ store }>
      <IntlProvider locale='en' messages={ localeMessages }>
        <Router history={hashHistory}>
          <Route path="/" component={ App }>
            <IndexRoute component={ Home } />
            <Route path="settings/accounts/add" component={ AutoconfigSetup } />
            <Route path="view/3col" component={ ThreeCol } />
            <Route path="debug/cronsync" component={ DebugCronsync } />
          </Route>
        </Router>
      </IntlProvider>
    </Provider>,
    document.getElementById('content')
  );
});
});
