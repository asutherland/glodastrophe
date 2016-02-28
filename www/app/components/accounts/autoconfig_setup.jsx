define(function (require) {
'use strict';

const React = require('react');

const { FormattedMessage, injectIntl } = require('react-intl');

/**
 * Largely pre-redux autoconfig widget.  Wrapped into minimal redux integration
 * via `WrappedAutoconfigSetup` widget.  Definitely consider reduxifying
 * further.
 */
const AutoconfigSetup = React.createClass({
  propTypes: {
    mailApi: React.PropTypes.object.isRequired,
    onAccountCreated: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      // future work: show a spinner overlay and disable the inputs while pending
      autoconfigInProgress: false,
      errorCode: null,
      errorDetails: null,
      displayName: '',
      emailAddress: '',
      password: '',
      learnedBlob: null,
    };
  },

  render: function() {
    var errorNodes = [];
    if (this.state.autoconfigInProgress) {
      return (
        <div>AutoconfiguratinG</div>
      );
    }
    if (this.state.errorCode) {
      errorNodes.push(
        <div key={this.state.errorCode}>
          {this.state.errorCode}: {JSON.stringify(this.state.errorDetails)}
        </div>
      );
    }

    var learnbox;
    if (this.state.learnedBlob) {
      learnbox = (
        <div>
          <pre>{ JSON.stringify(this.state.learnedBlob, null, 2) }</pre>
          <button onClick={ this.createUsingLearnedInfo }>Create using learned info</button>
        </div>
      );
    }

    const { formatMessage } = this.props.intl;

    return (
      <div className="add-account-page">
        <div>{ errorNodes }</div>
        <div>{ learnbox }</div>
        <h1>
          <FormattedMessage
            id='setupAutoconfigHeaderTitle'
            />
        </h1>
        <div>
          <input type="text"
            value={this.state.displayName}
            onChange={this.handleNameChange}
            placeholder={ formatMessage({ id: 'setupAutoconfigDisplayNamePlaceholder' }) }
            />
        </div>
        <div>
          <input type="email"
            value={this.state.emailAddress}
            onChange={this.handleEmailChange}
            placeholder={ formatMessage({ id: 'setupAutoconfigEmailAddressPlaceholder' }) }
            />
        </div>
        <div>
          <input type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            placeholder={ formatMessage({ id: 'setupAutoconfigPasswordPlaceholder' }) }
            />
        </div>
        <div>
          <button onClick={ this.startAutoconfig }>
            <FormattedMessage
              id='setupAutoconfigTriggerAutoconfigButtonLabel'
            />
          </button>
          <button onClick={ this.learnAboutAccount }>LearN AbouT AccounT</button>

        </div>
      </div>
    );
  },

  // These seem inefficient, but perhaps the clarity is worth the boilerplate?
  handleNameChange: function(evt) {
    this.setState({ displayName: evt.target.value });
  },

  handleEmailChange: function(evt) {
    this.setState({ emailAddress: evt.target.value });
  },

  handlePasswordChange: function(evt) {
    this.setState({ password: evt.target.value });
  },

  learnAboutAccount: function() {
    var mailApi = this.props.mailApi;
    mailApi.learnAboutAccount(
      {
        emailAddress: this.state.emailAddress
      })
    .then((results) => {
      this.setState({ learnedBlob: results });
    });
  },

  createUsingLearnedInfo: function() {
    this.doCreate(this.state.learnedBlob.configInfo);
  },

  startAutoconfig: function() {
    this.doCreate(null);
  },

  doCreate: function(domainInfo) {
    var mailApi = this.props.mailApi;

    // don't have multiple autoconfigs in flight at the same time
    if (this.state.autoconfigInProgress) {
      return;
    }

    // Indicate an autoconfig is in progress and clear existing error state.
    this.setState({
      autoconfigInProgress: true,
      errorCode: null,
      errorDetails: null
    });
    mailApi.tryToCreateAccount(
      {
        displayName: this.state.displayName,
        emailAddress: this.state.emailAddress,
        password: this.state.password,
      },
      domainInfo)
    .then(({ error, errorDetails, account }) => {
      // If there's an error, update state
      if (error) {
        this.setState({
          autoconfigInProgress: false,
          errorCode: error,
          errorDetails
        });
        return;
      }

      this.props.onAccountCreated(account.id);
    });
  }
});

return injectIntl(AutoconfigSetup);
});
