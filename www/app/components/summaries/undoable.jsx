define(function (require) {
'use strict';

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var Undoable = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    let op = this.props.op;
    return (
      <div className="undoable">
        <span>
          <FormattedMessage
            message={ this.getIntlMessage(`undoable_${op.affectedType}_${op.operation}`) }
            count={ op.affectedCount } />
        </span>
        <button className="undo-button"
          onClick={ this.clickUndo }>
          <FormattedMessage
            message={ this.getIntlMessage('undoButton') } />
        </button>
      </div>
    );
  },

  clickUndo: function() {
    this.props.op.undo();
  }
});

return Undoable;
});
