import React from 'react';

import { Button, Divider, Form } from 'semantic-ui-react';
import { Localized } from '@fluent/react';


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

      phabServerUrl: 'https://phabricator.services.mozilla.com/',
      phabApiKey: '',

      bugzillaServerUrl: 'https://bugzilla.mozilla.org/',
      bugzillaApiKey: '',

      icalCalendarUrl: '',
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePhabServerChange = this.handlePhabServerChange.bind(this);
    this.handlePhabKeyChange = this.handlePhabKeyChange.bind(this);
    this.handleBugzillaServerChange = this.handleBugzillaServerChange.bind(this);
    this.handleBugzillaKeyChange = this.handleBugzillaKeyChange.bind(this);
    this.handleIcalCalendarUrlChange = this.handleIcalCalendarUrlChange.bind(this);

    this.startAutoconfig = this.startAutoconfig.bind(this);
    this.startPhabricatorAdd = this.startPhabricatorAdd.bind(this);
    this.startBugzillaAdd = this.startBugzillaAdd.bind(this);
    this.startIcalAdd = this.startIcalAdd.bind(this);
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

    return (
      <div className="add-account-page">
        <div>{ errorNodes }</div>
        <div>{ learnbox }</div>
        <section>
          <h1><Localized id='setupAutoconfig_headerTitle' /></h1>
          <Form>
            <Form.Field>
              <label><Localized id='setupAutoconfig_displayName_label' /></label>
              <Localized id="setupAutoconfig_displayName_input" attrs={{placeholder: true}}>
                <input type="text"
                  value={this.state.displayName}
                  onChange={this.handleNameChange}
                  />
              </Localized>
            </Form.Field>
            <Form.Field>
              <label><Localized id='setupAutoconfig_emailAddress_label' /></label>
              <Localized id="setupAutoconfig_emailAddress_input" attrs={{placeholder: true}}>
                <input type="text"
                  value={this.state.emailAddress}
                  onChange={this.handleEmailChange}
                  />
              </Localized>
            </Form.Field>
            <Form.Field>
              <label><Localized id='setupAutoconfig_password_label' /></label>
              <Localized id="setupAutoconfig_password_input" attrs={{placeholder: true}}>
                <input type="password"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  />
              </Localized>
            </Form.Field>
            <Button onClick={ this.startAutoconfig }>
              <Localized id='setupAutoconfigTriggerAutoconfigButtonLabel' />
            </Button>
            <Button onClick={ this.learnAboutAccount }>
              <Localized id='setupAutoconfig_debugAutoconfig_label' />
            </Button>
          </Form>
        </section>
        <Divider />
        <section>
          <h1><Localized id='setup_manual_phabricator_header' /></h1>
          <Form>
            <Form.Field>
              <label><Localized id='setup_manual_phabricator_server_label' /></label>
              <Localized id="setup_manual_phabricator_server_input" attrs={{placeholder: true}}>
                <input type="text"
                  value={this.state.phabServerUrl}
                  onChange={this.handlePhabServerChange}
                  />
              </Localized>
            </Form.Field>
            <Form.Field>
              <label><Localized id='setup_manual_phabricator_apiKey_label' /></label>
              <Localized id="setup_manual_phabricator_apiKey_input" attrs={{placeholder: true}}>
                <input type="text"
                  value={this.state.phabApiKey}
                  onChange={this.handlePhabKeyChange}
                  />
              </Localized>
            </Form.Field>
            <Button onClick={ this.startPhabricatorAdd }>
              <Localized
                id='setupAutoconfigTriggerAutoconfigButtonLabel'
              />
            </Button>
          </Form>
        </section>
        <Divider />
        <section>
          <h1><Localized id='setup_manual_bugzilla_header' /></h1>
          <Form>
            <Form.Field>
              <label><Localized id='setup_manual_bugzilla_server_label' /></label>
              <Localized id="setup_manual_bugzilla_server_input" attrs={{placeholder: true}}>
                <input type="text"
                  value={this.state.bugzillaServerUrl}
                  onChange={this.handleBugzillaServerChange}
                  />
              </Localized>
            </Form.Field>
            <Form.Field>
              <label><Localized id='setup_manual_bugzilla_apiKey_label' /></label>
              <Localized id="setup_manual_bugzilla_apiKey_input" attrs={{placeholder: true}}>
                <input type="text"
                  value={this.state.bugzillaApiKey}
                  onChange={this.handleBugzillaKeyChange}
                  />
              </Localized>
            </Form.Field>
            <Button onClick={ this.startBugzillaAdd }>
              <Localized
                id='setupAutoconfigTriggerAutoconfigButtonLabel'
              />
            </Button>
          </Form>
        </section>
        <Divider />
        <section>
          <h1><Localized id='setup_manual_ical_header' /></h1>
          <Form>
            <Form.Field>
              <label><Localized id='setup_manual_ical_calendar_url_label' /></label>
              <Localized id="setup_manual_ical_calendar_url_input" attrs={{placeholder: true}}>
                <input type="text"
                  value={this.state.icalCalendarUrl}
                  onChange={this.handleIcalCalendarUrlChange}
                  />
              </Localized>
            </Form.Field>
            <Button onClick={ this.startIcalAdd }>
              <Localized
                id='setupAutoconfigTriggerAutoconfigButtonLabel'
              />
            </Button>
          </Form>
        </section>
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

  handlePhabServerChange(evt) {
    this.setState({ phabServerUrl: evt.target.value });
  }

  handlePhabKeyChange(evt) {
    this.setState({ phabApiKey: evt.target.value });
  }

  handleBugzillaServerChange(evt) {
    this.setState({ bugzillaServerUrl: evt.target.value });
  }

  handleBugzillaKeyChange(evt) {
    this.setState({ bugzillaApiKey: evt.target.value });
  }

  handleIcalCalendarUrlChange(evt) {
    this.setState({ icalCalendarUrl: evt.target.value });
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

  async startPhabricatorAdd() {
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
    let { error, errorDetails, account } = await mailApi.tryToCreateAccount(
      {
        phabServerUrl: this.state.phabServerUrl,
        phabApiKey: this.state.phabApiKey,
      },
      {
        type: 'phabricator',
      });

    if (error) {
      this.setState({
        autoconfigInProgress: false,
        errorCode: error,
        errorDetails
      });
      return;
    }

    this.props.onAccountCreated(account.id);
  }

  async startBugzillaAdd() {
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
    let { error, errorDetails, account } = await mailApi.tryToCreateAccount(
      {
        bugzillaServerUrl: this.state.bugzillaServerUrl,
        bugzillaApiKey: this.state.bugzillaApiKey,
      },
      {
        type: 'bugzilla',
      });

    if (error) {
      this.setState({
        autoconfigInProgress: false,
        errorCode: error,
        errorDetails
      });
      return;
    }

    this.props.onAccountCreated(account.id);
  }

  async startIcalAdd() {
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
    let { error, errorDetails, account } = await mailApi.tryToCreateAccount(
      {
        calendarUrl: this.state.icalCalendarUrl,
      },
      {
        type: 'ical',
      });

    if (error) {
      this.setState({
        autoconfigInProgress: false,
        errorCode: error,
        errorDetails
      });
      return;
    }

    this.props.onAccountCreated(account.id);
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
