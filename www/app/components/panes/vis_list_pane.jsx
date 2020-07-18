import React from 'react';
import PropTypes from 'prop-types';

import WholeWindowedList from '../whole_windowed_list';
import VegaVis from '../visualizations/vega_vis';

export default class VisListPane extends React.PureComponent {
  render() {
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
};

VisListPane.propTypes = {
  views: PropTypes.array.isRequired
};
