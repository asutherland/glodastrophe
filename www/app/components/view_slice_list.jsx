define(function (require) {

var React = require('react');
var IntlMixin = require('react-intl').IntlMixin;

var ReactList = require('react-list');

/**
 * Bind a BridgedViewSlice to a ReactList.  Our mapping is currently extremely
 * simple.  We just trigger a re-render whenever we are hinted that anything
 * has happened in the list.  In the future we probably want to provide some
 * type of shouldComponentUpdate support either in ourselves or in a mixin for
 * the actual rendering classes.  Rather than using sets, we could do something
 * like put a _generation on each item and update it each time it gets changed
 * or added, etc.  (And I mean a unified generation number, not just something
 * we increment on each item as a sort of change counter, although that would
 * also work.)
 */
var ViewSliceList = React.createClass({
  mixins: [IntlMixin],

  getInitialState: function() {
    return {
      generation: 0
    };
  },

  componentWillMount: function() {
    this.boundDirtyHandler = this.handleDirty; //.bind(this);
    this.boundRenderer = this.renderItem; //.bind(this);

    var slice = this.props.slice;
    // seeked is for windowed list views
    slice.on('seeked', this.boundDirtyHandler);
    // complete is for entire list views
    slice.on('complete', this.boundDirtyHandler);
  },

  componentWillUnmount: function() {
    var slice = this.props.slice;
    slice.removeListener('seeked', this.boundDirtyHandler);
    slice.removeListener('complete', this.boundDirtyHandler);
  },

  handleDirty: function() {
    console.log('got a dirty notification!', this.props.slice.items.length);
    this.setState({
      generation: this.state.generation + 1
    });
  },

  render: function() {
    console.log('re-rendering', this.props.slice.items.length);
    return (
      <ReactList
        items={this.props.slice.items}
        renderItem={this.boundRenderer}
        uniform={true}
        />
    );
  },

  renderItem: function(item) {
    var Widget = this.props.widget;
    if (!item) {
      return <div>LoadinG</div>;
    }
    return <Widget key={item.id} item={item} />
  }
});

return ViewSliceList;
});
