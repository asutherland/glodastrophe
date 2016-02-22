define(function (require) {
'use strict';

const React = require('react');

const ListItem = require('material-ui/lib/lists/list-item');

const AccountListItem = React.createClass({
  render: function() {
    const account = this.props.item;
    return (
      <ListItem
        primaryText={ account.name }
        leftIcon={ <FontIcon className="material-icons">account circle</FontIcon> }
        />
    );
  },
});

return AccountListItem;
});
