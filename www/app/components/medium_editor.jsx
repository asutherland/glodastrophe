define(function (require) {
'use strict';

var React = require('react');

var RealMediumEditor = require('medium-editor');

/**
 * A non-react-idiomatic use of MediumEditor informed by
 * https://github.com/yabwe/medium-editor/issues/383 but being very paranoid
 * about the huge HTML emails that people can end up with.  Specifically, we're
 * viewing innerHTML serializations and assignment as potentially horribly
 * expensive, so we only want to do those on demand when saving the state of the
 * draft.
 *
 * XXX We're currently a rich editor that acts like a rich editor but serializes
 * to/from plaintext.  Extra problematically, the medium editor really loves
 * creating paragraph tags.
 *
 * Our life-cycle is this:
 * - We are instantiated, being provided the current HTML string that describes
 *   the message and a function to invoke when the document gets dirtied.
 * - We invoke the onDirty function provided to us the first time a change is
 *   made to the HTML.  To that, we provide a function that will return the
 *   current HTML state and clear/reset our dirty flag so that the thing will
 *   fire again in the future.
 * - We do that forever until unmounted.  If you want to reset our state, make
 *   sure we get destroyed, I guess.
 */
var MediumEditor = React.createClass({
  componentDidMount: function() {
    let editorNode = React.findDOMNode(this);
    this.populateEditor(editorNode, this.props.initialContent);

    this.dirty = false;
    this.medium = new RealMediumEditor(
      editorNode,
      this.props.options);
    this.medium.subscribe('editableInput', () => {
      if (!this.dirty) {
        this.dirty = true;
        this.props.onDirty(this.getState);
      }
    });
  },

  getState: function() {
    this.dirty = false;
    return this.fromEditor(React.findDOMNode(this));
  },

  shouldComponentUpdate: function() {
    return false;
  },

  componentWillUnmount: function() {
    this.medium.destroy();
  },

  /**
   * Inserts an email into the contenteditable element.
   */
  populateEditor: function(editorNode, value) {
    var lines = value.split('\n');
    var frag = document.createDocumentFragment();
    for (var i = 0, len = lines.length; i < len; i++) {
      if (i) {
        frag.appendChild(document.createElement('br'));
      }

      if (lines[i]) {
        frag.appendChild(document.createTextNode(lines[i]));
      }
    }

    // Need at least one text node for tapping and keyboard display to work.
    if (!frag.childNodes.length) {
      frag.appendChild(document.createTextNode(''));
    }

    editorNode.appendChild(frag);
  },

  /**
   * Gets the raw value from a contenteditable div
   */
  fromEditor: function(editorNode) {
    var content = '';
    var len = editorNode.childNodes.length;
    var lastWasPara = false;
    for (var i = 0; i < len; i++) {
      var node = editorNode.childNodes[i];
      if (node.nodeName === 'BR' &&
          // Gecko's contenteditable implementation likes to create a
          // synthetic trailing BR with type="_moz".  We do not like/need
          // this synthetic BR, so we filter it out.  Check out
          // nsTextEditRules::CreateTrailingBRIfNeeded to find out where it
          // comes from.
          node.getAttribute('type') !== '_moz') {
        content += '\n';
        lastWasPara = false;
      } else if (node.nodeName === 'P') {
        // - Deal with medium-editor liking paragraphs a lot.
        // (NB: It's reasonable for it to like paragraphs, and we want that when
        // we're all modernized and composing HTML, but it's not super great for
        // us right now.)
        if (lastWasPara) {
          content += '\n';
        }
        lastWasPara = true;
        content += node.textContent + '\n';
      } else {
        lastWasPara = false;
        content += node.textContent;
      }
    }

    return content;
  },

  render: function() {
    return (
      <div className="draft-body-editor"
        contentEditable="true"
        >
      </div>
    );
  }
});

return MediumEditor;
});
