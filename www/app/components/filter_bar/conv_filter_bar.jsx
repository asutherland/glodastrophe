define(function (require) {
'use strict';

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var ConvFilterBar = React.createClass({
  mixins: [IntlMixin],

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
          this.props.applyFilter(filter);
          this.timer = null;
        }, 500);
      } else {
        this.props.applyFilter(null);
      }
    }
  },

  render: function() {
    return (
      <div className="conv-filter-bar">
        <input type="text"
          value={ this.state.filterText }
          onChange={ this.onFilterTextChange }
          placeholder={ this.getIntlMessage('filter_text_placeholder') }
          />
        <label>
          <input type="checkbox"
            checked={ this.state.filterSender }
            onChange={ this.onSenderChange } />
          <FormattedMessage
            message={ this.getIntlMessage('filter_sender') } />
        </label>
        <label>
          <input type="checkbox"
            checked={ this.state.filterRecipients }
            onChange={ this.onRecipientsChange } />
          <FormattedMessage
            message={ this.getIntlMessage('filter_recipients') } />
        </label>
        <label>
          <input type="checkbox"
            checked={ this.state.filterSubject }
            onChange={ this.onSubjectChange } />
          <FormattedMessage
            message={ this.getIntlMessage('filter_subject') } />
        </label>
        <label>
          <input type="checkbox"
            checked={ this.state.filterBody }
            onChange={ this.onBodyChange }/>
          <FormattedMessage
            message={ this.getIntlMessage('filter_body') } />
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

return ConvFilterBar;
});
