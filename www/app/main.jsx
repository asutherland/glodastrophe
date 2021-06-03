import React from 'react';
window.React = React;

import ReactDOM from 'react-dom';
window.ReactDOM = ReactDOM;

import { HashRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store';

// Make sure the backend spins up no matter what and provide a convenient way to
// get at it in the developer console.
import mailApi from 'gelam/main-frame-setup';
window.mailApi = mailApi;

// -- Pages
import Home from './components/home/home';

import WrappedAutoconfigSetup from './containers/wrapped_autoconfig_setup';

import Sidebar from './components/pages/sidebar';
import ThreeCol from './components/pages/three_col';

import { selectDefaultAccount } from './actions/viewing';

// - Debug Views
import DebugCronsync from './components/debuggy/debug_cronsync';

// -- l10n stuff
import { FluentBundle, FluentResource } from '@fluent/bundle';
import { ReactLocalization, LocalizationProvider } from '@fluent/react';
import messages_enUS from 'locales/en-US.ftl';

import 'semantic-ui-css/semantic.min.css';


const resource_enUS = new FluentResource(messages_enUS);
const bundle_enUS = new FluentBundle('English');
bundle_enUS.addResource(resource_enUS);
const l10n = new ReactLocalization([bundle_enUS]);


class App extends React.Component {
  render() {
    return this.props.children;
  }
}

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
      <LocalizationProvider l10n={l10n}>
        <HashRouter>
          <Switch>
            <Route exact path="/" component={ Home } />
            <Route path="/settings/accounts/add" component={ WrappedAutoconfigSetup } />
            <Route path="/view/3col" component={ ThreeCol } />
            <Route path="/debug/cronsync" component={ DebugCronsync } />
          </Switch>
        </HashRouter>
      </LocalizationProvider>
    </Provider>,
    document.getElementById('content')
  );
});

