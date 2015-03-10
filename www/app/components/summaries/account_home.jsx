define(function (require) {

var React = require('react');

var AccountHome = React.createClass({
  render: function() {
    return (
      <div>
        <div>Account: { this.props.item.name }</div>
        <div><a href={'#!/view/folders/' + this.props.item.id}>FolderS</a></div>
      </div>
    );
  }
});

return AccountHome;
});
