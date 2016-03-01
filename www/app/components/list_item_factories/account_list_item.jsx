define(function (require) {
'use strict';

const React = require('react');

const ListItem = require('material-ui/lib/lists/list-item');
const FontIcon = require('material-ui/lib/font-icon');

return function makeAccountListItem(account) {
  const icon = <FontIcon className="material-icons">account_circle</FontIcon>;
  return (
    <ListItem
      key={ account.id }
      value={ account.id }
      primaryText={ account.name }
      leftIcon={ icon }
      />
  );
};
});
