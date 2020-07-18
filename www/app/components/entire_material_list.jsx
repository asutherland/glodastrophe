import React from 'react';
import PropTypes from 'prop-types';

import { List } from '@material-ui/core';

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
export default class EntireMaterialList extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  getInitialState() {
    return {
      serial: this.props.view.serial,
    };
  }

  componentWillMount() {
    var view = this.props.view;
    view.on(this.props.viewEvent, this.handleDirty);
    if (this.props.viewEvent === 'seeked') {
      view.seekToTop(10, 990);
    }
  }

  componentWillUnmount() {
    var view = this.props.view;
    view.removeListener(this.props.viewEvent, this.handleDirty);
  }

  componentWillReceiveProps(nextProps) {
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
  }

  handleDirty() {
    this.setState({
      serial: this.props.view.serial
    });
  }

  render() {
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
  }

  onChangeSelection(evt, value) {
    this.props.pick(value);
  }
}

EntireMaterialList.defaultProps = {
  itemHeight: 0,
};

EntireMaterialList.propTypes = {
  passProps: PropTypes.object,
  pick: PropTypes.func.isRequired,
  selectedId: PropTypes.string,
  subheader: PropTypes.string.isRequired,
  view: PropTypes.object.isRequired,
  // allows us to sorta transparently support both view types.
  viewEvent: PropTypes.string.isRequired,
  /**
   * We have to use a factory instead of a widget because the
   * SelectableContainerEnhance depends on being able to introspect the
   * immediate children and have them be ListItems.  Happily, there isn't
   * really any difference.
   */
  listItemFactory: PropTypes.func.isRequired
};