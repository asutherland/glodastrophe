define(function (require) {
'use strict';

const React = require('react');

const PureRenderMixin = require('react-addons-pure-render-mixin');

const List = require('material-ui/lib/lists/list');
const SelectableContainerEnhance =
  require('material-ui/lib/hoc/selectable-enhance');

const SelectableList = SelectableContainerEnhance(List);

/**
 * Bind a EntireListview to a material-ui List with support for its selection
 * mechanism based on a higher-order-component and ValueLink.  Based on our
 * previous ReactList-based EntireList.
 *
 * Currently no effort is made to do virtual-list stuff although it's likely to
 * be desirable for the list of folders case.  However, that also gets into
 * collapsible folder hiearchy issues which are their own complexity.  So we'll
 * deal with that when we need to.
 */
var EntireMaterialList = React.createClass({
  mixins: [PureRenderMixin],

  defaultProps: {
    itemHeight: 0
  },

  getInitialState: function() {
    return {
      serial: this.props.view.serial,
    };
  },

  componentWillMount: function() {
    this.boundDirtyHandler = this.handleDirty; //.bind(this);
    this.boundRenderer = this.renderItem; //.bind(this);
    this.boundSeek = this.seek;

    var view = this.props.view;
    view.on('complete', this.boundDirtyHandler);
  },

  componentWillUnmount: function() {
    var view = this.props.view;
    view.removeListener('complete', this.boundDirtyHandler);
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.view) {
      this.props.view.removeListener('complete', this.boundDirtyHandler);
    }
    if (nextProps.view) {
      this.setState({ serial: nextProps.view.serial });
      nextProps.view.on('complete', this.boundDirtyHandler);
    }
  },

  handleDirty: function() {
    this.setState({
      serial: this.props.view.serial
    });
  },

  render: function() {
    const Widget = this.props.widget;

    const children = this.props.view.items.map((item) => {
      return (
        <Widget key={item.id} value={ item.id } serial={ item.serial } />
      );
    });

    const valueLink = {
      value: this.props.selectedId,
      requestChange: this.props.pick
    };

    return (
      <SelectableList
        valueLink={ valueLink }
        subheader={ this.props.subheader }
        >
        { children }
      </SelectableList>
    );
  }
});

return EntireMaterialList;
});
