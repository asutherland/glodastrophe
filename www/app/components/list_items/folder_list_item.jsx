import React from 'react';
import { List } from 'semantic-ui-react';

const DEFAULT_FOLDER_ICON = 'folder outline';
const FOLDER_TYPE_TO_ICON_TYPE = new Map([
  ['nomail', 'navigate_next'], // really sketchy
  ['inbox', 'inbox'],
  ['drafts', 'firstdraft'],
  ['localdrafts', 'firstdraft'],
  ['sent', 'send'],
  ['trash', 'trash'],
  ['archive', 'archive'],
  ['junk', 'exclamation circle'],
  ['starred', 'star outline'],
  ['important', 'bell outline'],
  ['normal', DEFAULT_FOLDER_ICON]
]);

/**
 * Folder items in the SidebarMenu to display folder overview info and allow
 * them to be selected.  Likely to be overhauled somewhat to allow for a
 * collapsible tree hierarchy.  See consumers for more info.
 */
export default function FolderListItem(props) {
  const folder = props.item;

  const iconType = FOLDER_TYPE_TO_ICON_TYPE.get(folder.type) ||
    DEFAULT_FOLDER_ICON;
  // `nestedLevel`: It seems like this might have been part of the material UI
  // listItem, but because our representation is flattened in the virtual
  // list, we do want this to work.  Probably the best thing is just to go with
  // direct semantic mark-up as that will allow collapsing.
  //
  // TODO: correct to do actual semantic nesting and collapsing
  return (
    <List.Item
      key={ folder.id }
      value={ folder.id }
      content={ folder.name }
      icon={ iconType }
      nestedLevel={ folder.depth }
      />
  );
};
