import { List } from 'semantic-ui-react';

export default function AccountListItem(props) {
  const account = props.item;

  return (
    <List.Item
      key={ account.id }
      value={ account.id }
      content={ account.name }
      icon='user circle outline'
      />
  );
};
