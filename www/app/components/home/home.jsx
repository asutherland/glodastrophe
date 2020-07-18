import React from 'react';

import { Localized } from "@fluent/react";
import { Link } from 'react-router-dom';

import EntireList from '../entire_list';

// XXX connect() this widget into redux-space so we can stop doing this.
import mailApi from 'gelam/main-frame-setup';

import AccountHome from '../summaries/account_home';

const containerStyle = {
  margin: '10px'
};

/**
 * The "home" view currently shows a list of summaries of accounts.  I created
 * this primarily to be a place to put the "add an account" link without needing
 * a customized "hey, I see you have no accounts" thing.  But I also had the
 * noble goal to provide some info about the accounts that might be slightly
 * useful.  So now the goal is dashboard craziness.
 *
 * There is no intent to provide a useful UX here.  Ideally evolve this into
 * nothingness and evolve the summaries into something useful.
 */
export default class Home extends React.Component {
  render() {
    return (
      <div style={ containerStyle }>
        <EntireList
          view={ mailApi.accounts }
          widget={ AccountHome }
          />
        <div style={ { paddingTop: '1em '} }>
          <Link to="/settings/accounts/add">
            <Localized
              id='settingsAccountAddLink'
              />
          </Link>
        </div>
        <div>
          <h2>
            <Localized
              id='debugHomeHeader'
              />
          </h2>
          <Link to="/debug/cronsync">
            <Localized
              id='debugCronSync'
              />
          </Link>
        </div>
      </div>
    );
  }
};
