import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import AutoconfigSetup from '../components/accounts/autoconfig_setup';

const { selectAccountId } = require('../actions/viewing');

// Note: I think the new react-redux idiom is to directly do the hookup in the
// widgets directly, whereas I've just transformed the usage of connect() here
// so that we can use the `useHistory` hook here to get at the HashHistory.
export default function WrappedAutoconfigSetup() {
  const mailApi = useSelector(state => state.mailApi);
  const dispatch = useDispatch();
  const history = useHistory();

  const onAccountCreated = (accountId) => {
    dispatch(selectAccountId(accountId));
    history.push('/view/3col');
  };

  return (
    <AutoconfigSetup
      mailApi={ mailApi }
      onAccountCreated={ onAccountCreated }
      />
  );
}
