import React from 'react';
import PropTypes from 'prop-types';

import { Localized } from "@fluent/react";


/**
 * Largely pre-redux autoconfig widget.  Wrapped into minimal redux integration
 * via `WrappedAutoconfigSetup` widget.  Definitely consider reduxifying
 * further.
 */
export default class AutoconfigSetup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // future work: show a spinner overlay and disable the inputs while pending
      autoconfigInProgress: false,
      errorCode: null,
      errorDetails: null,
      displayName: '',
      emailAddress: '',
      password: '',
      learnedBlob: null,
    };
  }

  render() {
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
          <Localized
            id='setupAutoconfig_headerTitle'
            />
        </h1>
        <div>
          <Localized id="setupAutoconfig_input_displayName" attrs={{placeholder: true}}>
            <input type="text"
              value={this.state.displayName}
              onChange={this.handleNameChange}
              placeholder={ formatMessage({ id: 'setupAutoconfigDisplayNamePlaceholder' }) }
              />
          </Localized>
        </div>
        <div>
          <Localized id="setupAutoconfig_input_emailAddress" attrs={{placeholder: true}}>
            <input type="email"
              value={this.state.emailAddress}
              onChange={this.handleEmailChange}
              />
          </Localized>
        </div>
        <div>
          <Localized id="setupAutoconfig_input_password" attrs={{placeholder: true}}>
            <input type="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              placeholder={ formatMessage({ id: 'setupAutoconfigPasswordPlaceholder' }) }
              />
          </Localized>
        </div>
        <div>
          <button onClick={ this.startAutoconfig }>
            <Localized
              id='setupAutoconfigTriggerAutoconfigButtonLabel'
            />
          </button>
          <button onClick={ this.learnAboutAccount }>LearN AbouT AccounT</button>

        </div>
      </div>
    );
  }

  // These seem inefficient, but perhaps the clarity is worth the boilerplate?
  handleNameChange(evt) {
    this.setState({ displayName: evt.target.value });
  }

  handleEmailChange(evt) {
    this.setState({ emailAddress: evt.target.value });
  }

  handlePasswordChange(evt) {
    this.setState({ password: evt.target.value });
  }

  learnAboutAccount() {
    var mailApi = this.props.mailApi;
    mailApi.learnAboutAccount(
      {
        emailAddress: this.state.emailAddress
      })
    .then((results) => {
      this.setState({ learnedBlob: results });
    });
  }

  createUsingLearnedInfo() {
    this.doCreate(this.state.learnedBlob.configInfo);
  }

  startAutoconfig() {
    this.doCreate(null);
  }

  doCreate(domainInfo) {
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
}
