define(function (require) {
'use strict';

const React = require('react');

const { FormattedMessage } = require('react-intl');

var AccountHome = React.createClass({
  render: function() {
    return (
      <div className='account-home-summary'>
        <div className='ahs-border'>
          <div className='ahs-header'>Account: { this.props.item.name }</div>
          <div className='ahs-contents'>
            <div className='ahs-details'>
              <a href={ '#!/view/3col/' + this.props.item.id + '/./.' }
                 className='ahs-detail'>
                <FormattedMessage
                  id='accountHomeShow3Col'
                  />
              </a>
              <a href={ '#!/view/folders/' + this.props.item.id }
                 className='ahs-detail'>
                <FormattedMessage
                  id='accountHomeShowFolders'
                  />
              </a>
            </div>
            <div className='ahs-actions'>
              <button onClick={ this.recreateAccount }>
                <FormattedMessage
                  id='recreateAccount'
                  />
              </button>
              <button onClick={ this.deleteAccount }>
                <FormattedMessage
                  id='deleteAccount'
                  />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },

  recreateAccount: function() {
    this.props.item.recreateAccount();
  },

  deleteAccount: function() {
    this.props.item.deleteAccount();
  }
});

return AccountHome;
});
