define(function (require) {

var React = require('react');

var FormattedMessage = require('react-intl').FormattedMessage;

var EntireList = require('../entire_list');

var AccountHome = require('../summaries/account_home');

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
var Home = React.createClass({
  render: function() {
    return (
      <div>
        <EntireList
          view={this.props.mailApi.accounts}
          widget={AccountHome}
          />
        <div>
          <a href="#!/settings/accounts/add">
            <FormattedMessage
              id='settingsAccountAddLink'
              />
          </a>
        </div>
        <div>
          <h2>
            <FormattedMessage
              id='debugHomeHeader'
              />
          </h2>
          <a href="#!/debug/cronsync">
            <FormattedMessage
              id='debugCronSync'
              />
          </a>
        </div>
      </div>
    );
  },
});

return Home;
});
