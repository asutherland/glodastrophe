import React from 'react';
import PropTypes from 'prop-types';

import FacetingVegaVisContainer from
  '../visualizations/faceting_vega_vis_container';

export default class FacetingVisListPane extends React.PureComponent {
  render() {
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
};

FacetingVisListPane.propTypes = {
  views: PropTypes.array.isRequired
};
