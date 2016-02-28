define(function (require) {
'use strict';

const React = require('react');

const { injectIntl } = require('react-intl');

const Card = require('material-ui/lib/card/card');
const CardActions = require('material-ui/lib/card/card-actions');
const CardHeader = require('material-ui/lib/card/card-header');
const FlatButton = require('material-ui/lib/flat-button');

const { selectAccountId } = require('../../actions/viewing');

var AccountHome = React.createClass({
  propTypes: {
    item: React.PropTypes.object.isRequired
  },

  contextTypes: {
    store: React.PropTypes.object,
    router: React.PropTypes.object
  },

  render: function() {
    const account = this.props.item;
    const { formatMessage } = this.props.intl;
    return (
      <Card>
        <CardHeader
          title={ account.name }
          subtitle={ account.type }
          actAsExpander={ true }
          showExpandableButton={ true }
          />
        <CardActions expandable={ true } >
          <FlatButton
            label={ formatMessage({ id: 'show_account_contents' }) }
            onTouchTap={ this.showAccount }
            />
          <FlatButton
            label={ formatMessage({ id: 'recreateAccount' }) }
            onTouchTap={ this.recreateAccount }
            />
          <FlatButton
            label={ formatMessage({ id: 'deleteAccount' }) }
            onTouchTap={ this.deleteAccount }
            />
        </CardActions>
      </Card>
    );
  },

  showAccount: function() {
    console.log('got show account click!');
    const account = this.props.item;
    this.context.store.dispatch(selectAccountId(account.id));
    this.context.router.push('/view/3col');
  },

  recreateAccount: function() {
    this.props.item.recreateAccount();
  },

  deleteAccount: function() {
    this.props.item.deleteAccount();
  }
});

return injectIntl(AccountHome);
});
