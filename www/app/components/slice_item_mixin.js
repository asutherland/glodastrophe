define(function(require) {
'use strict';

return {
  shouldComponentUpdate: function(nextProps, nextState) {
    return (this.props.serial !== nextProps.serial) ||
           (this.props.selected !== nextProps.selected);
  }
};
});
