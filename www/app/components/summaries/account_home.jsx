define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var AccountHome = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    return (
      <div className='account-home-summary'>
        <div className='ahs-header'>Account: { this.props.item.name }</div>
        <div className='ahs-contents'>
          <div className='ahs-details'>
            <a href={'#!/view/folders/' + this.props.item.id}>
              <FormattedMessage
                message={ this.getIntlMessage('accountHomeShowFolders') }
                />
            </a>
          </div>
          <div className='ahs-actions'>
            <button onClick={ this.deleteAccount }>
              <FormattedMessage
                message={ this.getIntlMessage('deleteAccount') }
                />
            </button>
          </div>
        </div>
      </div>
    );
  },

  deleteAccount: function() {
    this.props.item.deleteAccount();
  }
});

return AccountHome;
});
