define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var Autosuggest = require('autosuggest');

var TagAdder = React.createClass({
  mixins: [IntlMixin],

  /**
   * Filter the list of known labels.
   */
  getSuggestions: function(input, callback) {
    var conv = this.props.conversation;
    var allLabels = conv.getKnownLabels();
    // future work: use an escaping regex mechanism.
    var lowerInput = input.toLocaleLowerCase();
    return allLabels.filter((folder) => {
      return folder.name.toLocaleLowerCase().indexOf(lowerInput) !== -1;
    });
  },

  renderSuggestion: function(folder, input) {
    // TODO: highlight the matching substring stuff
    // TODO: depth stuff
    return (
      <div>{folder.name}</div>
    );
  },

  getSuggestionValue: function(folder) {
    // We don't actually want to put anything in the text field.  We use
    // onSuggestionSelected to actually perform the tag adding.
    return '';
  },

  render: function() {
    var conv = this.props.conversation;
    var classes = 'taggy-item';
    var folder = this.props.folder;

    // XXX placeholder localization
    var inputAttributes = {
      placeholder: 'Add tag...'
    };

    return (
      <Autosuggest
        id="addtag-conversation"
        suggestions={ this.getSuggestions }
        suggestionRenderer={ this.renderSuggestion }
        suggestionValue={ this.getSuggestionValue }
        onSuggestionSelected={ this.addTag }
        inputAttributes={ inputAttributes }
        />
    );
  },

  addTag: function(folder) {
    var conv = this.props.conversation;
    
  }
});

return TagAdder;
});
