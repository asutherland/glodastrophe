define(function (require) {
'use strict';

const React = require('react');

const PureRenderMixin = require('react-addons-pure-render-mixin');

const List = require('material-ui/lib/lists/list');
const { SelectableContainerEnhance } =
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

  propTypes: {
    passProps: React.PropTypes.object,
    pick: React.PropTypes.func.isRequired,
    selectedId: React.PropTypes.string,
    subheader: React.PropTypes.string.isRequired,
    view: React.PropTypes.object.isRequired,
    // allows us to sorta transparently support both view types.
    viewEvent: React.PropTypes.string.isRequired,
    /**
     * We have to use a factory instead of a widget because the
     * SelectableContainerEnhance depends on being able to introspect the
     * immediate children and have them be ListItems.  Happily, there isn't
     * really any difference.
     */
    listItemFactory: React.PropTypes.func.isRequired
  },

  defaultProps: {
    itemHeight: 0
  },

  getInitialState: function() {
    return {
      serial: this.props.view.serial,
    };
  },

  componentWillMount: function() {
    var view = this.props.view;
    view.on(this.props.viewEvent, this.handleDirty);
    if (this.props.viewEvent === 'seeked') {
      view.seekToTop(10, 990);
    }
  },

  componentWillUnmount: function() {
    var view = this.props.view;
    view.removeListener(this.props.viewEvent, this.handleDirty);
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.view) {
      this.props.view.removeListener(this.props.viewEvent, this.handleDirty);
    }
    if (nextProps.view) {
      this.setState({ serial: nextProps.view.serial });
      nextProps.view.on(this.props.viewEvent, this.handleDirty);
      if (this.props.viewEvent === 'seeked') {
        nextProps.view.seekToTop(10, 990);
      }
    }
  },

  handleDirty: function() {
    this.setState({
      serial: this.props.view.serial
    });
  },

  render: function() {
    const listItemFactory = this.props.listItemFactory;
    const { passProps } = this.props;

    const children = this.props.view.items.map(
      item => listItemFactory(item, passProps));

    const valueLink = {
      value: this.props.selectedId,
      requestChange: this.onChangeSelection
    };

    return (
      <SelectableList
        valueLink={ valueLink }
        subheader={ this.props.subheader }
        >
        { children }
      </SelectableList>
    );
  },

  onChangeSelection: function(evt, value) {
    this.props.pick(value);
  }
});

return EntireMaterialList;
});
