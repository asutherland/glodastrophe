import React from 'react';

import { Localized } from "@fluent/react";

// The undoable widget itself is eventually intended to be a reusable popup-ish
// thing.
import Undoable from '../summaries/undoable';

const MAX_KEPT_UNDO_OPS = 10;

/**
 * Stateful list widget of recent undoable operations.  There is currently no
 * backend abstraction to track such a list itself, so we maintain that state
 * here ourselves. We register on the MailAPI to hear about new
 * UndoableOperations and add them to our (capped) list.
 */
export default class DebugUndoableTracker extends React.Component {
  getInitialState() {
    return {
      undoableOps: [],
      serial: 0
    };
  }

  componentDidMount() {
    const mailApi = this.props.mailApi;
    mailApi.on('undoableOp', this.onNewUndoableOp);
    mailApi.on('undoing', this.onUndoing);

    mailApi.flushNewAggregates();
  }

  componentWillUnmount() {
    const mailApi = this.props.mailApi;
    mailApi.removeListener('undoableOp', this.onNewUndoableOp);
    mailApi.removeListener('undoing', this.onUndoing);
  }

  onNewUndoableOp(op) {
    const curOps = this.state.undoableOps;
    this.setState({
      undoableOps: [op].concat(curOps).slice(0, MAX_KEPT_UNDO_OPS),
      serial: this.state.serial + 1
    });
  }

  onUndoing(op) {
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
  }

  render() {
    let opWidgets = this.state.undoableOps.map((op) => {
      return <Undoable key={ op.id } op={ op } />;
    });

    return (
      <div>
        <h3 key='head'>
          <Localized
            id='debugUndoTrackerHeader' />
        </h3>
        { opWidgets }
      </div>
    );
  }
};
