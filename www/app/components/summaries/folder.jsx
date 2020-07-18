import React from 'react';

export default function FolderSummary(props) {
  const folder = props.item;
  function onClickFolder() {
    if (props.pick && folder.selectable) {
      props.pick(folder);
    }
  }

  let classes = 'folder-item';
  if (props.selected) {
    classes += ' folder-item-selected';
  }

  let { selectable } = folder;
  classes += ' folder-depth' + folder.depth;
  classes += selectable ? ' folder-selectable' : ' folder-unselectable';

  let selectableStuff;
  if (selectable) {
    let maybeSyncStatus;
    if (folder.syncStatus) {
      maybeSyncStatus = <span> [{folder.syncStatus}]</span>;
    }
    selectableStuff = (
      <span>
        <span> ({ folder.localUnreadConversations })</span>
        { maybeSyncStatus }
      </span>
    );
  }

  // XXX debugging info that should be removed or made more formal.
  var tooltip = [
    'local unread conversations: ' + folder.localUnreadConversations,
    'local message count: ' + folder.localMessageCount,
    'fully synced: ' + folder.fullySynced
  ].join('\n');

  return (
    <div className={ classes }
          title={ tooltip }
          onClick={ onClickFolder }>
      <span>{ folder.name }</span>
      { selectableStuff }
    </div>
  );
};