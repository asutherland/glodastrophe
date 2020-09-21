import React from 'react';
import { List } from 'semantic-ui-react';

export default function AccountListItem(props) {
  const account = props.item;

  let content = (
    <React.Fragment>
      { account.name }
    </React.Fragment>
  );
  if (props.selected) {
    content = (
      <b>{ content }</b>
    );
  }

  return (
    <List.Item className="clickable-list-item"
      key={ account.id }
      value={ account.id }
      active={ props.selected }
      content={ content }
      icon='user circle outline'
      onClick={ () => { props.pick(account.id); } }
      />
  );
}
