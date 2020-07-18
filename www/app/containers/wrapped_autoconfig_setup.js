import { connect } from 'react-redux';
const { hashHistory } = require('react-router');

import AutoconfigSetup from '../components/accounts/autoconfig_setup';

const { selectAccountId } = require('../actions/viewing');

const mapStateToProps = (state) => {
  return {
    mailApi: state.mailApi
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    /**
     * When the account is created, select the account (and its inbox) and
     * navigate to the 3col view.
     */
    onAccountCreated: (accountId) => {
      dispatch(selectAccountId(accountId));
      hashHistory.push('/view/3col');
    },
  };
};

/**
 * I clearly have no idea how to name this.
 */
const WrappedAutoconfigSetup = connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoconfigSetup);

export default WrappedAutoconfigSetup;
