define(function (require) {
'use strict';

const React = require('react');

const ListItem = require('material-ui/lib/lists/list-item');

const FacetingVegaVis = require('../visualizations/faceting_vega_vis');

return function makeFacetingVegaVisItem(item, { view, viewDef }) {
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
    <ListItem
      key={ item.id }
      value={ label }
      primaryText={ label }
      secondaryText={ vegaVis }
      />
  );
};
});
