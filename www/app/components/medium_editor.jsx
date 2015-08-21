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
    this.dirty = false;
    this.medium = new RealMediumEditor(
      React.findDOMNode(this),
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
    return React.findDOMNode(this);
  },

  shouldComponentUpdate: function() {
    return false;
  },

  componentWillUnmount: function() {
    this.medium.destroy();
  },

  render: function() {
    return (
      <div
        contentEditable="true"
        dangerouslySetInnerHTML={ { __html: this.props.initialContent } }
        >
      </div>
    );
  }
});

return MediumEditor;
});
