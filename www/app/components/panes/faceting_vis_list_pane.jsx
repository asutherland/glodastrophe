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
      return (
        <FacetingVegaVisContainer
          key={ view.handle }
          view={ view }
          />
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
