import React from 'react';
import FacetingVegaVisItem from '../list_items/faceting_vega_vis_item';

// We're fine pulling in all of Vega in the front-end.
//const vega = require('vega');

const EntireList = require('../entire_list');

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
export default class FacetingVegaVisContainer extends React.PureComponent {
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

  render() {
    const { view } = this.props;
    /*
    const { chart } = this.state;

    if (!chart) {
      return <div></div>;
    }
    */

    const viewDef = view.viewDef;
    const extra = {
      //chart,
      view,
      viewDef
    };

    // XXX want to show `viewDef.frontend.header` as some kind of heading.
    // XXX this claimed it was using the viewEvent "seeked"???
    return (
      <EntireList
        view={ view }
        widget={ FacetingVegaVisItem }
        extra={ extra }
        />
    );
  }
};
