define(function (require) {
'use strict';

var React = require('react');

const { FormattedMessage, injectIntl } = require('react-intl');

/**
 * XXX needs redux overhaul
 *
 * Very hacky initial implementation of filtering UI.  Our owning panes have a
 * state life-cycle that involves us being destroyed whenever we pass a change
 * up to them.  Our very awkward contract with them is that we communicate in
 * the MailAPI-form filter spec representation.  The state for us to consume
 * on instantiation is in the `initialFilter` prop and our mechanism for
 * updating the effective filter is to invoke the passed-in `applyFilter` prop.
 * We use setState with our `serial` idiom and abuse componentWillUpdate in
 * order to know when to call `applyFilter`.
 *
 * This is all horrible and seems like a textbook example of where something
 * like redux is almost certainly appropriate.  (Also, I made the wrong call
 * when deciding we'd deal in the spec-filter rep.  We should be using a
 * UI-centric representation and having the pane convert when it calls search*.)
 *
 * The plan for now is to leave this a gross mess until after I do a first pass
 * at the faceted UI.  Since we want the faceting and what not to live in the
 * back-end since it allows us to potentially farm things out to a server
 * backend (and keep the main thread responsive), it's possible that the answer
 * will be to indeed create our filtering abstraction as part of the back-end
 * (although pieces may live in the front-end).  This would be consistent with
 * the discussion we had for gaia mail of creating a BrowserContext to replace
 * pieces of the model/header_cursor/list_cursor implementation.
 */
var ConvFilterBar = React.createClass({
  getInitialState: function() {
    this.timer = null;
    this.dirty = false;
    var filter = this.props.initialFilter || {
      author: true,
      recipients: true,
      subject: true,
      body: true
    };
    var existingFilterText =
      filter.author || filter.recipients || filter.subject || filter.body || '';
    return {
      serial: 0,
      filterText: existingFilterText === true ? '' : existingFilterText,
      filterSender: !!filter.author,
      filterRecipients: !!filter.recipients,
      filterSubject: !!filter.subject,
      filterBody: !!filter.body
    };
  },

  componentWillUpdate: function(nextProps, nextState) {
    // only generate a change if some input changed.
    if (nextState.serial !== this.state.serial) {
      if (nextState.filterText && nextState.filterText.length >= 3) {
        if (this.timer) {
          window.clearTimeout(this.timer);
        }
        let filter = {};
        if (nextState.filterSender) {
          filter.author = nextState.filterText;
        }
        if (nextState.filterRecipients) {
          filter.recipients = nextState.filterText;
        }
        if (nextState.filterSubject) {
          filter.subject = nextState.filterText;
        }
        if (nextState.filterBody) {
          filter.body = nextState.filterText;
        }
        // we use a timer to give the input time to stabilize.
        this.timer = window.setTimeout(() => {
          this.props.applyTextFilter(filter);
          this.timer = null;
        }, 500);
      } else {
        this.props.applyTextFilter(null);
      }
    }
  },

  render: function() {
    return (
      <div className="conv-filter-bar">
        <input type="text"
          value={ this.state.filterText }
          onChange={ this.onFilterTextChange }
          placeholder={ this.props.intl.formatMessage({ id: 'filter_text_placeholder' }) }
          />
        <label>
          <input type="checkbox"
            checked={ this.state.filterSender }
            onChange={ this.onSenderChange } />
          <FormattedMessage
            id='filter_sender' />
        </label>
        <label>
          <input type="checkbox"
            checked={ this.state.filterRecipients }
            onChange={ this.onRecipientsChange } />
          <FormattedMessage
            id='filter_recipients' />
        </label>
        <label>
          <input type="checkbox"
            checked={ this.state.filterSubject }
            onChange={ this.onSubjectChange } />
          <FormattedMessage
            id='filter_subject' />
        </label>
        <label>
          <input type="checkbox"
            checked={ this.state.filterBody }
            onChange={ this.onBodyChange }/>
          <FormattedMessage
            id='filter_body' />
        </label>
      </div>
    );
  },

  onFilterTextChange: function(event) {
    this.setState({
      serial: this.state.serial + 1,
      filterText: event.target.value
    });
  },

  onSenderChange: function(event) {
    this.setState({
      serial: this.state.serial + 1,
      filterSender: event.target.checked
    });
  },

  onRecipientsChange: function(event) {
    this.setState({
      serial: this.state.serial + 1,
      filterRecipients: event.target.checked
    });
  },

  onSubjectChange: function(event) {
    this.setState({
      serial: this.state.serial + 1,
      filterSubject: event.target.checked
    });
  },

  onBodyChange: function(event) {
    this.setState({
      serial: this.state.serial + 1,
      filterBody: event.target.checked
    });
  },
});

return injectIntl(ConvFilterBar);
});
