define(function(require) {
'use strict';

return {
  shouldComponentUpdate: function(nextProps, nextState) {
    console.log('check update. curSerial:', this.props.serial, 'nextSerial:', nextProps.serial);
    return this.props.serial !== nextProps.serial;
  }
};
});
