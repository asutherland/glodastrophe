define(function(require) {
'use strict';

/**
 * A mix-in for use on live items when this widget isn't directly held by a
 * list container that is directly manipulating our serial prop.  (In that case
 * you should probably be using the `SliceItemMixin`.)
 */
return {
  componentWillMount: function() {
    if (this.props.item) {
      this.props.item.on('change', this._changed);
      this.setState({ serial: this.props.serial });
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.item !== nextProps.item) {
      if (this.props.item) {
        this.props.item.removeListener('change', this._changed);
      }
      if (nextProps.item) {
        nextProps.item.on('change', this._changed);
        // The item change will trigger the update, but we need to make sure
        // serial is consistent with the item so we don't run into us missing
        // an update.  (serials are item-local for tracked items.)
        this.setState({ serial: nextProps.item.serial });
      }
    }
  },

  componentWillUnmount: function() {
    if (this.props.item) {
      this.props.item.removeListener('change', this._changed);
    }
  },

  _changed: function() {
    this.setState({ serial: this.props.item.serial });
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return (this.state.serial !== nextState.serial) ||
           (this.props.item !== nextProps.item);
  }
};
});
