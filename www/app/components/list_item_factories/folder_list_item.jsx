define(function (require) {
'use strict';

const React = require('react');

const ListItem = require('material-ui/lib/lists/list-item');
const FontIcon = require('material-ui/lib/font-icon');

const DEFAULT_FOLDER_ICON = 'folder open';
const FOLDER_TYPE_TO_ICON_TYPE = new Map([
  ['nomail', 'navigate_next'], // really sketchy
  ['inbox', 'inbox'],
  ['drafts', 'drafts'],
  ['localdrafts', 'drafts'],
  ['sent', 'send'],
  ['trash', 'delete'],
  ['archive', 'archive'],
  ['junk', 'report'],
  ['starred', 'star_border'],
  ['important', 'label_outline'],
  ['normal', DEFAULT_FOLDER_ICON]
]);

/**
 * Folder items in the SidebarMenu to display folder overview info and allow
 * them to be selected.  Likely to be overhauled somewhat to allow for a
 * collapsible tree hierarchy.  See consumers for more info.
 */
return function makeFolderListItem(folder) {
  const iconType = FOLDER_TYPE_TO_ICON_TYPE.get(folder.type) ||
    DEFAULT_FOLDER_ICON;
  const icon = <FontIcon className="material-icons">{ iconType }</FontIcon>;
  return (
    <ListItem
      key={ folder.id }
      value={ folder.id }
      primaryText={ folder.name }
      leftIcon={ icon }
      nestedLevel={ folder.depth }
      />
  );
};
});
