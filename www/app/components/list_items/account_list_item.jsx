define(function (require) {
'use strict';

const React = require('react');

const ListItem = require('material-ui/lib/lists/list-item');
const FontIcon = require('material-ui/lib/font-icon');

const AccountListItem = React.createClass({
  propTypes: {
    item: React.PropTypes.object.isRequired
  },

  render: function() {
    const account = this.props.item;
    const icon = <FontIcon className="material-icons">account_circle</FontIcon>;
    return (
      <ListItem
        primaryText={ account.name }
        leftIcon={ icon }
        />
    );
  },
});

return AccountListItem;
});
