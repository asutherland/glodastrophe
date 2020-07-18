import VisListPane from
  '../components/panes/vis_list_pane';

import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    views: state.viewing.live.conversationsOverviewViews
  };
};

const mapDispatchToProps = (/*dispatch*/) => {
  return {
  };
};

const SelectedOverviewFacetsPane = connect(
  mapStateToProps,
  mapDispatchToProps
)(VisListPane);

export default SelectedOverviewFacetsPane;
