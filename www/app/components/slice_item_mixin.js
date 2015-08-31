define(function(require) {
'use strict';

return {
  /**
   * XXX I think this probably just wants to be superseded by the pure
   * functional mixin.  I've now done something very sketchy for the state
   * change detection to try and get "expanded" properly honored.
   */
  shouldComponentUpdate: function(nextProps, nextState) {
    return (this.props.serial !== nextProps.serial) ||
           (this.props.selected !== nextProps.selected) ||
           // XXX will this always be true?
           (nextState !== this.state);
  }
};
});
