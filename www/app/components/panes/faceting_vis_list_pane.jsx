define(function (require) {
'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');

const FacetingVegaVisContainer =
  require('../visualizations/faceting_vega_vis_container');


const FacetingVisListPane = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    views: React.PropTypes.array.isRequired
  },

  render: function() {
    const viewWidgets = this.props.views.map((view) => {
      const viewDef = view.viewDef;
      return (
        <div key={ view.handle }>
          <h3>{ viewDef.frontend.header }</h3>
          <FacetingVegaVisContainer
            view={ view }
            />
        </div>
      );
    });

    return (
      <div>
        { viewWidgets }
      </div>
    );
  }
});

return FacetingVisListPane;
});
