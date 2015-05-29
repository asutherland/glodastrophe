define(function (require) {
'use strict';

var React = require('react');
var IntlMixin = require('react-intl').IntlMixin;

/**
 * Display the entirety of a WindowedListView by rendering *ALL* of it into
 * the DOM.  No virtual list is used at all right now, although in the future
 * ReactList's caching height mode may be used.
 *
 * This component takes care of generating the seek requests itself.  (Which is
 * a top-capped seek with an absurd number of requested items.)
 */
var WholeWindowedList = React.createClass({
  mixins: [IntlMixin, React.addons.PureRenderMixin],

  getInitialState: function() {
    return {
      serial: this.props.view.serial,
    };
  },

  componentWillMount: function() {
    this.boundDirtyHandler = this.handleDirty; //.bind(this);
    this.boundSeek = this.seek;

    var view = this.props.view;
    // seeked is for windowed list views
    view.on('seeked', this.boundDirtyHandler);

    // A thousand of whatever this is is enough!
    view.seekToTop(10, 990);
  },

  componentWillUnmount: function() {
    if (this.props.view) {
      this.props.view.removeListener('seeked', this.boundDirtyHandler);
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.view) {
      this.props.view.removeListener('seeked', this.boundDirtyHandler);
    }
    if (nextProps.view) {
      this.setState({ serial: nextProps.view.serial });
      nextProps.view.on('seeked', this.boundDirtyHandler);
      // A thousand of whatever this is is enough!
      nextProps.view.seekToTop(10, 990);
    }
  },

  handleDirty: function() {
    this.setState({
      serial: this.props.view.serial
    });
  },

  render: function() {
    var widgets = this.props.view.items.map(this.renderItem);
    return (
      <div>
        {widgets}
      </div>
    );
  },

  renderItem: function(item) {
    // Note: The react-widget seems to be making the assumption that we'll use
    // the relIndex as our key, although it doesn't actually depend on this.
    var Widget = this.props.widget;
    if (!item) {
      // XXX come up with a better placeholder in the future.
      return <div key={ 'rel' + relIndex }>LoadinG</div>;
    }
    return <Widget key={ item.id } item={ item } serial={ item.serial }
                   selected={ this.props.selectedId === item.id }
                   pick={ this.props.pick } />
  }
});

return WholeWindowedList;
});
