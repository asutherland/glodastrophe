define(function (require) {
'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');

const vega = require('vega');

const FacetingVegaVis = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    //chart: React.PropTypes.func.isRequired,
    item: React.PropTypes.object.isRequired,
    serial: React.PropTypes.number.isRequired,
    view: React.PropTypes.object.isRequired,
    viewDef: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return { vis: null };
  },

  componentDidMount: function() {
    const { item, viewDef } = this.props;
    vega.parse.spec(viewDef.frontend.spec, (chart) => {
      const vis = chart({
        el: this.refs.visContainer,
        // This call primarily being made on the basis of it being able to debug
        // things using the DOM insepctor tool if things are living in SVG.
        // Arguably canvas might actually be the way to go in many scenarios.
        renderer: 'svg'
      });

      const useData = item.data[viewDef.frontend.dataFrom];
      vis.data(viewDef.frontend.injectDataInto).insert(useData);

      // XXX state management trainwreck here.
      this.setState({ vis });

      vis.update();
    });
  },

  componentDidUpdate: function() {
    const { vis } = this.state;
    const { view, viewDef, item } = this.props;

    //
    if (viewDef.frontend.tocMetaData) {
      const tocMeta = view.tocMeta;
      for (let { table, sourceField, targetField, otherValues } of
             viewDef.frontend.tocMetaData) {
        // remove anything in there already
        let stream = vis.data(table).remove(() => true);
        let values = (otherValues || []).map((value) => {
          return { [targetField]: value };
        });
        values.push({
          [targetField]: tocMeta[sourceField]
        });
        stream.insert(values);
      }
    }

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
  },

  componentWillUnmount: function() {
    if (this.state.vis) {
      this.state.vis.destroy();
    }
  },

  render: function() {
    const { viewDef, item } = this.props;
    const label = item.data[viewDef.frontend.labelFrom];

    return (
      <div>
        <div>{ label }</div>
        <div ref='visContainer' />
      </div>
    );
  }
});

return FacetingVegaVis;
});
