import React, { useCallback } from 'react';
import { Localized } from '@fluent/react';

import { useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";

import { Button, Card } from 'semantic-ui-react';


import { selectAccountId } from '../../actions/viewing';

export default function AccountHome(props) {
  const account = props.item;
  const dispatch = useDispatch();
  const history = useHistory();

  function doShowAccount() {
    dispatch(selectAccountId(account.id));
    history.push('/view/3col');
  }

  return (
    <Card>
      <Card.Content>
        <Card.Header>{ account.name }</Card.Header>
        <Card.Meta>{ account.type }</Card.Meta>
      </Card.Content>
      <Card.Content>
        <Button onClick={ doShowAccount } >
          <Localized id='show_account_contents' />
        </Button>
        <Button onClick={ () => { account.recreateAccount(); } } >
          <Localized id='recreateAccount' />
        </Button>
        <Button onClick={ () => { account.deleteAccount(); } } >
          <Localized id='deleteAccount' />
        </Button>
        <Button onClick={ () => { account.syncFolderList(); } } >
          <Localized id='syncAccountFolderList' />
        </Button>
      </Card.Content>
    </Card>
  );
}
