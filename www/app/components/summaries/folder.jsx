define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var FolderSummary = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    var classes = 'folder-item';
    if (this.props.selected) {
      classes += ' folder-item-selected';
    }

    var folder = this.props.item;

    return (
      <div className={ classes } onClick={ this.clickFolder }>
        <span>{ folder.path }</span>
        <span> ({ folder.localUnreadConversations })</span>
      </div>
    );
  },

  clickFolder: function() {
    if (this.props.pick) {
      this.props.pick(this.props.item);
    }
  }
});

return FolderSummary;
});
