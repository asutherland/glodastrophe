define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var Autosuggest = require('autosuggest');

var ComposePeepSuggestion = require('jsx!./compose_peep_suggestion');

/**
 * Input area for adding peeps to a mail with some very limited autocompletion
 * support.
 */
var ComposePeepAdder = React.createClass({
  mixins: [IntlMixin],

  componentDidMount: function() {
    var inputNode = this.inputNode =
      React.findDOMNode(this.refs.autosuggest.refs.input);
    inputNode.addEventListener('keydown', this.onInputInput);
  },

  /**
   * Process characters that terminate manual address input/bubble-ification or
   * should delete an existing bubble.  The autosuggest widget also processes
   * keydown events, specifically enter (only when there is currently a
   * suggestion) as well as up/down/escape for suggestion maintenance.
   *
   * We process:
   * - space / comma / semicolon: This bubbles the input if the value seems
   *   sufficiently valid and our position is at the end of the input.
   * - enter: This terminates entry if the value up to our cursor position seems
   *
   * - backspace: This nukes a bubble
   */
  onInputKeyDown: function(event) {
    let inputNode = this.inputNode;
    let inputValue = inputNode.value;
    // The input looks emaily if there's an at-sign in there.
    let looksEmaily = inputValue.indexOf('@') !== -1;
    let cursorPos = (inputNode.selectionStart === inputNode.selectionEnd) &&
                    inputNode.selectionStart;
    let atStart = cursorPos === 0;
    let atEnd = cursorPos === inputValue.length;

    let clearValue = false;

    switch (event.keyCode) {
      // - Possible address delimiters
      case 32: // Space
      case 44: // Comma
      case 59: // semicolon
        if (looksEmaily) {
          clearValue = this.addRecipientFromString(inputValue);
        }
        break;

      // - Unambiguous
      case 13: // Enter
        // If a suggestion completed, because that listener gets added before
        // this one (I know, such elegant logic, right?) and our handler for
        // that will empty out the value, we know if there's anything here that
        // it's worth processing.
        if (inputValue) {
          // We don't want the enter ending up in the text no matter what.
          event.preventDefault();

          // If we're at the end of the string, add.
          if (atEnd) {
            clearValue = this.addRecipientFromString(inputValue);
          }
          // If we're in the middle, try and add what leads up to the cursor.
          else if (cursorPos) {
            let usePortion = inputValue.substring(0, cursorPos);
            let leftover = inputValue.substring(cursorPos);
            if (this.addRecipientFromString(usePortion)) {
              inputNode.value = leftover;
            }
          }
        }
        break;
      case 8: // backspace
        if (atStart) {
          this.props.composer.removeLastRecipient(this.props.bin);
        }
        break;
    }

    if (clearValue) {
      inputNode.value = '';
    }
  },

  getSuggestions: function(input, callback) {
    if (!input) {
      callback(null, []);
      return;
    }

    this.props.api.shoddyAutocomplete(input).then(
      (matchedPeeps) => {
        callback(null, matchedPeeps);
      },
      (err) => {
        callback(err);
      });
  },

  renderSuggestion: function(peep/*, input*/) {
    // TODO: highlight the matching substring stuff
    return (
      <ComposePeepSuggestion peep={ peep } />
    );
  },

  getSuggestionValue: function(peep) {
    return peep.address;
  },

  render: function() {
    var idName = 'addrecip-' + this.props.bin;

    var inputAttributes = {
      type: 'email'
    };

    return (
      <Autosuggest
        ref="autosuggest"
        id={ idName }
        suggestions={ this.getSuggestions }
        suggestionRenderer={ this.renderSuggestion }
        suggestionValue={ this.getSuggestionValue }
        onSuggestionSelected={ this.addRecipientFromSuggestion }
        inputAttributes={ inputAttributes }
        />
    );
  },

  /**
   * Try and add a recipient based on the contents of the input box.  Any
   * automagic delimiting (ex: space/comma/semicolon triggers addition) should
   * have prevented the value from being manipulated or performed a
   * transformative fix-up prior to calling us.
   */
  addRecipientFromInput: function() {
    let value = this.inputNode.value;
    // Try and add the recipient.  But if the parse fails, leave things intact.
    if (this.addRecipientFromString(value)) {
      this.inputNode.value = '';
    }
  },

  /**
   * Add a recipient from user-provided input.
   */
  addRecipientFromString: function(value) {
    let composer = this.props.composer;
    let mailbox = composer.api.parseMailbox(value);
    if (mailbox) {
      composer.addRecipient(
        this.props.bin,
        { name: mailbox.name, address: mailbox.address });
    }

    return false;
  },

  /**
   * Given an autocomplete suggestion, add the peep to the relevant recipient
   * list.
   */
  addRecipientFromSuggestion: function(peep) {
    this.props.composer.addRecipient(
      this.props.bin,
      { name: peep.name, address: peep.address });
    this.inputNode.value = '';
  }
});

return ComposePeepAdder;
});
