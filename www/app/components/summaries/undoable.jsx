define(function (require) {
'use strict';

var React = require('react');

var FormattedMessage = require('react-intl').FormattedMessage;

var Undoable = React.createClass({
  render: function() {
    let op = this.props.op;
    return (
      <div className="undoable">
        <span>
          <FormattedMessage
            id={ `undoable_${op.affectedType}_${op.operation}` }
            values={ {count: op.affectedCount } } />
        </span>
        <button className="undo-button"
          onClick={ this.clickUndo }>
          <FormattedMessage
            id='undoButton' />
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
