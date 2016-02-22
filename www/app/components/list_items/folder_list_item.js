define(function (require) {
'use strict';

const React = require('react');

const ListItem = require('material-ui/lib/lists/list-item');

const DEFAULT_FOLDER_ICON = 'folder open';
const FOLDER_TYPE_TO_ICON_TYPE = new Map([
  ['nomail', 'navigate next'], // really sketchy
  ['inbox', 'inbox'],
  ['drafts', 'drafts'],
  ['localdrafts', 'drafts'],
  ['sent', 'send'],
  ['trash', 'delete'],
  ['archive', 'archive'],
  ['junk', 'report'],
  ['starred', 'star border'],
  ['important', 'label outline'],
  ['normal', DEFAULT_FOLDER_ICON]
]);


const FolderListItem = React.createClass({
  render: function() {
    const folder = this.props.item;
    const iconType = FOLDER_TYPE_TO_ICON_TYPE.get(folder.type) ||
      DEFAULT_FOLDER_ICON;
    const icon = <FontIcon className="material-icons">{ iconType }</FontIcon>;
    return (
      <ListItem
        primaryText={ folder.name }
        leftIcon={ icon }
        nestedLevel={ folder.depth }
        />
    );
  },
});

return FolderListItem;
});
