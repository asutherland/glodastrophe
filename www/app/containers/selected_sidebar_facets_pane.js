import FacetingVisListPane from
  '../components/panes/faceting_vis_list_pane';

import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    views: state.viewing.live.conversationsSidebarViews
  };
};

const mapDispatchToProps = (/*dispatch*/) => {
  return {
  };
};

const SelectedSidebarFacetsPane = connect(
  mapStateToProps,
  mapDispatchToProps
)(FacetingVisListPane);

export default SelectedSidebarFacetsPane;
