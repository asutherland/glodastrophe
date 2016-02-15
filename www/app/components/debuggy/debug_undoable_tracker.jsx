define(function (require) {
'use strict';

var React = require('react');

var FormattedMessage = require('react-intl').FormattedMessage;

// The undoable widget itself is eventually intended to be a reusable popup-ish
// thing.
var Undoable = require('../summaries/undoable');

const MAX_KEPT_UNDO_OPS = 10;

/**
 * Stateful list widget of recent undoable operations.  There is currently no
 * backend abstraction to track such a list itself, so we maintain that state
 * here ourselves. We register on the MailAPI to hear about new
 * UndoableOperations and add them to our (capped) list.
 */
var DebugUndoableTracker = React.createClass({
  getInitialState: function() {
    return {
      undoableOps: [],
      serial: 0
    };
  },

  componentDidMount: function() {
    const mailApi = this.props.mailApi;
    mailApi.on('undoableOp', this.onNewUndoableOp);
    mailApi.on('undoing', this.onUndoing);

    mailApi.flushNewAggregates();
  },

  componentWillUnmount: function() {
    const mailApi = this.props.mailApi;
    mailApi.removeListener('undoableOp', this.onNewUndoableOp);
    mailApi.removeListener('undoing', this.onUndoing);
  },

  onNewUndoableOp: function(op) {
    const curOps = this.state.undoableOps;
    this.setState({
      undoableOps: [op].concat(curOps).slice(0, MAX_KEPT_UNDO_OPS),
      serial: this.state.serial + 1
    });
  },

  onUndoing: function(op) {
    const curOps = this.state.undoableOps;
    let idx = curOps.indexOf(op);
    console.log('undoing index', idx);
    if (idx !== -1) {
      curOps.splice(idx, 1);
      this.setState({
        undoableOps: curOps,
        serial: this.state.serial + 1
      });
    }
  },

  render: function() {
    let opWidgets = this.state.undoableOps.map((op) => {
      return <Undoable key={ op.id } op={ op } />;
    });

    return (
      <div>
        <h3 key='head'>
          <FormattedMessage
            id='debugUndoTrackerHeader' />
        </h3>
        { opWidgets }
      </div>
    );
  }
});

return DebugUndoableTracker;
});
