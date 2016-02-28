define(function (require) {
'use strict';

const React = require('react');

const { FormattedMessage } = require('react-intl');
const { Link } = require('react-router');

const EntireList = require('../entire_list');

// XXX connect() this widget into redux-space so we can stop doing this.
const mailApi = require('gelam/main-frame-setup');

const AccountHome = require('../summaries/account_home');

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
const Home = React.createClass({
  render: function() {
    return (
      <div style={ containerStyle }>
        <EntireList
          view={ mailApi.accounts }
          widget={ AccountHome }
          />
        <div>
          <Link to="/settings/accounts/add">
            <FormattedMessage
              id='settingsAccountAddLink'
              />
          </Link>
        </div>
        <div>
          <h2>
            <FormattedMessage
              id='debugHomeHeader'
              />
          </h2>
          <Link to="/debug/cronsync">
            <FormattedMessage
              id='debugCronSync'
              />
          </Link>
        </div>
      </div>
    );
  },
});

return Home;
});
