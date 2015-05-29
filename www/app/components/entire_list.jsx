define(function (require) {
'use strict';

var React = require('react');
var IntlMixin = require('react-intl').IntlMixin;

var ReactList = require('react-list').UniformList;

/**
 * Bind a EntireListview to a ReactList.  Our mapping is currently extremely
 * simple.  We just trigger a re-render whenever we are hinted that anything
 * has happened in the list.
 *
 * ## shouldComponentUpdate and generations/serial ##
 *
 * EntireListView maintains a `serial` attribute on itself and all the items
 * it contains.  Each (batched) update increments the serial of the list view,
 * and each item updated is stamped with the serial of the most recent update it
 * has received.  Accordingly, we know that an item needs to update if its
 * serial number is greater than the serial number it had when it was
 * registered.
 *
 * Relatedly, there's the issue of how to get the ReactList to update.  It uses
 * PureRenderMixin which means that its props/state must change.  Since we don't
 * want to/can't mess with its state, we can touch the props when a new
 * update comes in and a new serial is released.  It will re-render() itself
 * which means that we expect our renderItem method to be called.  At which
 * point we can also just make sure to reflect the item's serial onto its props
 * and shouldComponentUpdate can just check the serial between the old props
 * and the new props.
 */
var EntireList = React.createClass({
  mixins: [IntlMixin, React.addons.PureRenderMixin],

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
    return (
      <ReactList
        length={ this.props.view.items.length }
        itemHeight={ this.props.itemHeight }
        itemRenderer={ this.boundRenderer }
        serial={ this.props.view.serial }
        selectedId={ this.props.selectedId }
        />
    );
  },

  renderItem: function(absIndex, relIndex) {
    // Note: The react-widget seems to be making the assumption that we'll use
    // the relIndex as our key, although it doesn't actually depend on this.
    var Widget = this.props.widget;
    var item = this.props.view.items[absIndex];
    if (!item) {
      // if not yet loaded and to allow some DOM stability, key off the absolute
      // index.
      return <div key={ 'abs' + absIndex }>LoadinG</div>;
    }
    return <Widget key={ item.id } item={ item } serial={ item.serial }
                   selected={ this.props.selectedId === item.id }
                   pick={ this.props.pick }/>
  }
});

return EntireList;
});
