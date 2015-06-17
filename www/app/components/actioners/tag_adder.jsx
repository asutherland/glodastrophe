define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var Autosuggest = require('autosuggest');

/**
 * A widget to enable tagging a conversation.  It could also trivially support
 * tagging messages, but that's not a desired UI flow at this time because it
 * doesn't match up with gmail semantics.  Flags should likely be used for that.
 */
var TagAdder = React.createClass({
  mixins: [IntlMixin],

  /**
   * Filter the list of known labels.
   *
   * TODO: react-autosuggest caches our return values because it's assuming
   * AJAXy behaviour and what not.  The flux-friendly proposal at
   * https://github.com/moroshko/react-autosuggest/issues/27 seems like a better
   * long-term solution for this.
   */
  getSuggestions: function(input, callback) {
    var conv = this.props.conversation;
    var allLabels = conv.getKnownLabels();
    // future work: use an escaping regex mechanism.
    var lowerInput = input.toLocaleLowerCase();
    var matches = allLabels.filter((folder) => {
      return folder.name.toLocaleLowerCase().indexOf(lowerInput) !== -1;
    });
    callback(null, matches);
  },

  renderSuggestion: function(folder, input) {
    // TODO: highlight the matching substring stuff
    // TODO: depth stuff
    return (
      <div>{folder.path}</div>
    );
  },

  getSuggestionValue: function(folder) {
    return folder.name;
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
        ref="autosuggest"
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
    conv.addLabels([folder]);
    // clear the value.
    React.findDOMNode(this.refs.autosuggest.refs.input).value = '';
  }
});

return TagAdder;
});
