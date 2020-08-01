import React from 'react';
import PropTypes from 'prop-types';

import { QuantizedHeightList } from '../quantized-list';

/**
 * Bind a WindowedListView to a ReactList.  Our mapping is currently extremely
 * simple.  We just trigger a re-render whenever we are hinted that anything
 * has happened in the list.
 *
 * RECENT / XXX: We used to depend on react-component-width-mixin.  This has
 * been removed for now, but it's probably appropriate to adopt use of a hook
 * like `useResizeObserver` from https://github.com/jaredLunde/react-hook.
 * (And in general given the component is already fairly complex, perhaps a hook
 * rewrite is the way to go anyways?)
 *
 * ## shouldComponentUpdate and generations/serial ##
 *
 * WindowedListView maintains a `serial` attribute on itself and all the items
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
export default class WindowedList extends React.PureComponent {
  getInitialState() {
    return {
      // We haven't actually rendered anything at this point, don't latch the
      // current serial.
      serial: null
    };
  }

  componentWillMount() {
    this.boundDirtyHandler = this.handleDirty; //.bind(this);
    this.boundRenderer = this.renderItem; //.bind(this);
    this.boundSeek = this.seek;

    var view = this.props.view;
    // seeked is for windowed list views
    view.on('seeked', this.boundDirtyHandler);
  }

  componentWillUnmount() {
    var view = this.props.view;
    view.removeListener('seeked', this.boundDirtyHandler);
  }

  componentWillReceiveProps(nextProps) {
    // TODO: consider whether we really want ourselves to morph like this.
    // I've already had to `key` the ReactList to insure that we get it to
    // generate a seek request against us.  That's sort of a weird regression
    // that might get cleaned up when we clean up our splitter and virtual list
    // implementations, but there isn't a clear reason to justify having this
    // component know how to morph.
    if (this.props.view) {
      this.props.view.removeListener('seeked', this.boundDirtyHandler);
    }
    if (nextProps.view) {
      this.setState({ serial: null });
      nextProps.view.on('seeked', this.boundDirtyHandler);
    }
  }

  handleDirty() {
    this.setState({
      serial: this.props.view.serial
    });
  }

  seek(offset, before, visible, after) {
    if (this.props.view) {
      // If we're at the top of the list, use seekToTop so that we latch to
      // the top and so new conversations that come in
      if (offset === 0) {
        this.props.view.seekToTop(visible, after);
      } else {
        this.props.view.seekInCoordinateSpace(
          offset, before, visible, after
        );
      }
    }
  }

  render() {
    if (!this.props.view) {
      return <div></div>;
    }

    // We pass in the following props exclusively to cause shouldComponentUpdate
    // to decide that it does need to update:
    // - serial: The serial/generation number of the list.  Strictly increasing
    //   for the given view.
    // - viewHandle: The handle of the view.  If all views used the same
    //   generation clock, we wouldn't need this.  We could also pass the view
    //   in since the equivalency test would do the right thing, but there is
    //   no actual need for the list to ever look at the view, so the handle is
    //   arguably better because it's simpler.
    // - selectedId: When the selection changes the list needs to be re-rendered
    //   so the impacted items can update.  Only those whose selection states
    //   have changed will actually update/re-render.
    //
    // NB: There are currently some performance problems coming from the fact
    // that ReactList is applying its transform on the outer containing div.
    // It should instead be applying transforms on each of the items in order
    // to avoid reflowing all of the items.
    return (
      <QuantizedHeightList
        key={ this.props.view.handle }
        seek={ this.boundSeek }
        totalHeight={ this.props.view.totalHeight }
        initialIndex={ 0 }
        itemRenderer={ this.boundRenderer }
        seekedOffset={ this.props.view.heightOffset }
        seekedData={ this.props.view.items }
        serial={ this.props.view.serial }
        viewHandle={ this.props.view.handle }
        unitSize={ this.props.unitSize }
        selectedId={ this.props.selectedId }
        />
    );
  }

  renderItem(item, relIndex/*, unitSize*/) {
    // Note: The react-widget seems to be making the assumption that we'll use
    // the relIndex as our key, although it doesn't actually depend on this.
    var conditionalWidget = this.props.conditionalWidget;
    var passProps = this.props.passProps;
    var Widget;
    if (conditionalWidget) {
      Widget = conditionalWidget(item);
    } else {
      Widget = this.props.widget;
    }
    if (!item) {
      // XXX come up with a better placeholder in the future.
      return <div key={ 'rel' + relIndex }>LoadinG</div>;
    }
    return (
      <Widget
        {...passProps}
        key={ item.id }
        item={ item }
        serial={ item.serial }
        selected={ this.props.selectedId === item.id }
        pick={ this.props.pick }
        />
    );
  }
};

WindowedList.propTypes = {
  conditionalWidget: PropTypes.func,
  passProps: PropTypes.object,
  pick: PropTypes.func.isRequired,
  selectedId: PropTypes.string,
  unitSize: PropTypes.number.isRequired,
  view: PropTypes.object.isRequired,
  widget: PropTypes.func,
};
