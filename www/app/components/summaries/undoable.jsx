import React from 'react';

import { Localized } from "@fluent/react";

export default function Undoable(props) {
  const op = props.op;

  function onClickUndo() {
    op.undo();
  }

  return (
    <div className="undoable">
      <span>
        <FormattedMessage
          id={ `undoable_${op.affectedType}_${op.operation}` }
          values={ {count: op.affectedCount } } />
      </span>
      <button className="undo-button"
        onClick={ onClickUndo }>
        <Localized
          id='undoButton' />
      </button>
    </div>
  );
}
