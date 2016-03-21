define(function (require) {
'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');


const WholeWindowedList = require('../whole_windowed_list');
const VegaVis = require('../visualizations/vega_vis');


const VisListPane = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    views: React.PropTypes.array.isRequired
  },

  render: function() {
    const viewWidgets = this.props.views.map((view) => {
      const passProps = {
        viewDef: view.viewDef
      };
      return (
        <WholeWindowedList
          key={ view.handle }
          passProps={ passProps }
          view={ view }
          widget={ VegaVis }
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

return VisListPane;
});
