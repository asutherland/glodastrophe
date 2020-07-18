import React from 'react';
import { List } from 'semantic-ui-react';

import FacetingVegaVis from '../visualizations/faceting_vega_vis';

export default function FacetingVegaVisItem(props) {
  const { item } = props;
  const { view, viewDef } = props.extra;

  const label = item.data[viewDef.frontend.labelFrom];
  const vegaVis = (
    <FacetingVegaVis
      item={ item }
      serial={ item.serial }
      view={ view }
      viewDef={ viewDef }
      />
  );
  return (
    <List.Item
      key={ item.id }
      value={ label }
      header={ label }
      description={ vegaVis }
      />
  );
};
