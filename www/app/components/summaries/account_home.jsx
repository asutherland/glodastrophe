import React from 'react';
import { Localized } from '@fluent/react';

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

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
        <Button size='small' onClick={ doShowAccount } >
          <Localized id='show_account_contents' />
        </Button>
        <Button size='small' onClick={ () => { account.recreateAccount(); } } >
          <Localized id='recreateAccount' />
        </Button>
        <Button size='small' onClick={ () => { account.deleteAccount(); } } >
          <Localized id='deleteAccount' />
        </Button>
        <Button size='small' onClick={ () => { account.syncFolderList(); } } >
          <Localized id='syncAccountFolderList' />
        </Button>
      </Card.Content>
    </Card>
  );
}
