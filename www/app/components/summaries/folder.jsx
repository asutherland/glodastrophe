define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var FolderSummary = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    return <div><a href={'#!/view/folder/' + this.props.item.id}>{ this.props.item.path }</a></div>;
  }
});

return FolderSummary;
});
