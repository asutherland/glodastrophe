define(function (require) {
'use strict';

const React = window.React = require('react');
const ReactDOM = window.ReactDOM = require('react-dom');

const injectTapEventPlugin = require('react-tap-event-plugin');


const { IntlProvider } = require('react-intl');
const { Router, Route, IndexRoute, hashHistory } = require('react-router');
const { Provider } = require('react-redux');

const store = require('./store');

const localeMessages = require('locales/en-US');

// Make sure the backend spins up no matter what and provide a convenient way to
// get at it in the developer console.
const mailApi = window.mailApi = require('gelam/main-frame-setup');

// -- Pages
const Home = require('./components/home/home');

const WrappedAutoconfigSetup = require('./containers/wrapped_autoconfig_setup');

const ThreeCol = require('./components/pages/three_col');

const { selectDefaultAccount } = require('./actions/viewing');

// - Debug Views
const DebugCronsync = require('./components/debuggy/debug_cronsync');


var App = React.createClass({
  propTypes: {
    children: React.PropTypes.object.isRequired
  },

  render: function() {
    return this.props.children;
  }
});

injectTapEventPlugin();

/*
 * Only create bring up the UI once the backend has loaded.  This simplifies
 * things in terms of us being able to start out with a list of all the accounts
 * and their folders immediately available.
 *
 * The immediate motivation for this is that it reduces the permutation space
 * as I overhaul the UI.  In practice, really all we need to delay is the
 * dispatch of `selectDefaultAccount`.  And actually, it could even handle the
 * async stuff internally since we're using the thunk middleware.
 */
mailApi.latestOnce('accountsLoaded', () => {
  store.dispatch(selectDefaultAccount());

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
  console.log('rendering into DOM');
  ReactDOM.render(
    <Provider store={ store }>
      <IntlProvider locale='en' messages={ localeMessages }>
        <Router history={hashHistory}>
          <Route path="/" component={ App }>
            <IndexRoute component={ Home } />
            <Route path="settings/accounts/add" component={ WrappedAutoconfigSetup } />
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
