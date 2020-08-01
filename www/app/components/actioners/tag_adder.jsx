import React from 'react';

/**
 * TODO: Broken / disabled.  Removed the react-autosuggest component and it
 * seems semantic-ui's is probably good enough for these needs.
 *
 * A widget to enable tagging a conversation.  It could also trivially support
 * tagging messages, but that's not a desired UI flow at this time because it
 * doesn't match up with gmail semantics.  Flags should likely be used for that.
 */
export default class TagAdder extends React.Component {
  /**
   * Filter the list of known labels.
   *
   * TODO: react-autosuggest caches our return values because it's assuming
   * AJAXy behaviour and what not.  The flux-friendly proposal at
   * https://github.com/moroshko/react-autosuggest/issues/27 seems like a better
   * long-term solution for this.
   */
  getSuggestions(input, callback) {
    var conv = this.props.conversation;
    var allLabels = conv.getKnownLabels();
    // future work: use an escaping regex mechanism.
    var lowerInput = input.toLocaleLowerCase();
    var matches = allLabels.filter((folder) => {
      return folder.name.toLocaleLowerCase().indexOf(lowerInput) !== -1;
    });
    callback(null, matches);
  }

  renderSuggestion(folder, input) {
    // TODO: highlight the matching substring stuff
    // TODO: depth stuff
    return (
      <div>{folder.path}</div>
    );
  }

  getSuggestionValue(folder) {
    return folder.name;
  }

  render() {
    var conv = this.props.conversation;
    var classes = 'taggy-item';
    var folder = this.props.folder;

    // XXX placeholder localization
    var inputAttributes = {
      placeholder: 'Add tag...'
    };

    /*
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
    */
    return (
      <input type="text"></input>
    );
  }

  addTag(folder) {
    var conv = this.props.conversation;
    conv.addLabels([folder]);
    // clear the value.
    React.findDOMNode(this.refs.autosuggest.refs.input).value = '';
  }
};
