import React from 'react';

// We're fine pulling in all of Vega in the front-end.
import { parse } from 'vega';

/**
 * Vega visualization backed by data pre-computed by the backend (which tries
 * to run a subset of vega limited to pure data processing and not any
 * rendering logic.)
 */
export default class VegasVis extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      vis: null
    }
  }

  componentDidMount() {
    const { viewDef, item } = this.props;
    parse.spec(viewDef.frontend.spec, (chart) => {
      const vis = chart({
        el: this.refs.visContainer,
        // This call primarily being made on the basis of it being able to debug
        // things using the DOM insepctor tool if things are living in SVG.
        // Arguably canvas might actually be the way to go in many scenarios.
        renderer: 'svg'
      });

      const useData = item.data[viewDef.frontend.dataFrom];
      vis.data(viewDef.frontend.injectDataInto).insert(useData);

      this.setState({ vis });

      vis.update();
    });
  }

  componentDidUpdate() {
    const { vis } = this.state;
    const { viewDef, item } = this.props;

    // The data is currently super-duper opaque to us so remove it all and
    // add our current data.  If the back-end generating the data is being smart
    // about only generating updates when things have changed, this should
    // actually be fairly efficient.  Especially if most of the expensive
    // computation is happening on the back-end.
    const useData = item.data[viewDef.frontend.dataFrom];
    vis.data(viewDef.frontend.injectDataInto)
      .remove(() => true)
      .insert(useData);
    vis.update();
  }

  componentWillUnmount() {
    if (this.state.vis) {
      this.state.vis.destroy();
    }
  }

  render() {
    return (
      <div ref='visContainer' />
    );
  }
};
