define(function (require) {
'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');

// We're fine pulling in all of Vega in the front-end.
//const vega = require('vega');

const WholeWindowedList = require('../whole_windowed_list');

const FacetingVegaVis = require('../visualizations/faceting_vega_vis');


/**
 * Originally tried to create a single chart factory from the definition, but
 * we're back to each visualization parsing things on their own because the
 * scales get all screwed up otherwise and all but 1 of the visualizations
 * ends up effectively empty.
 *
 * OLD:
 * Instantiates a single chart factory for all of the facets in a visualization
 * in order to allow scales to be used consistently across all visualizations
 * even though we cram them in different widgets.
 */
const FacetingVegaVisContainer = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    view: React.PropTypes.object.isRequired,
  },

  /*
  getInitialState: function() {
    return {
      chart: null
    };
  },

  componentDidMount: function() {
    const { viewDef } = this.props.view;
    if (!this.state.chart) {
      vega.parse.spec(viewDef.frontend.spec, (chart) => {
        this.setState({ chart });
      });
    }
  },
  */

  render: function() {
    const { view } = this.props;
    /*
    const { chart } = this.state;

    if (!chart) {
      return <div></div>;
    }
    */

    const viewDef = view.viewDef;
    const passProps = {
      //chart,
      view,
      viewDef
    };
    return (
      <WholeWindowedList
        view={ view }
        widget={ FacetingVegaVis }
        passProps={ passProps }
        />
    );
  }
});

return FacetingVegaVisContainer;
});
