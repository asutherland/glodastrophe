define(function(require) {
'use strict';

const VisListPane =
  require('../components/panes/vis_list_pane');

const { connect } = require('react-redux');

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

return SelectedOverviewFacetsPane;
});
