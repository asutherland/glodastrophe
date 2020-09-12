import React from 'react';
import PropTypes from 'prop-types';

export class List extends React.PureComponent {
  constructor(props) {
    super(props);

    this.selfRef = React.createRef();

    this.state = {
      from: 0,
      size: this.props.pageSize
    };
  }

  UNSAFE_componentWillReceiveProps(next) {
    const {size} = this.state;
    const {length, pageSize} = next;
    this.setState({size: Math.min(Math.max(size, pageSize), length)});
  }

  componentDidMount() {
    this.scrollParent = this.getScrollParent();
    this.updateFrame = this.updateFrame.bind(this);
    window.addEventListener('resize', this.updateFrame);
    this.scrollParent.addEventListener('scroll', this.updateFrame);
    this.updateFrame();
    const {initialIndex} = this.props;
    if (initialIndex == null) return;
    this.afId = requestAnimationFrame(this.scrollTo.bind(this, initialIndex));
  }

  componentDidUpdate() {
    this.updateFrame();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateFrame);
    this.scrollParent.removeEventListener('scroll', this.updateFrame);
    cancelAnimationFrame(this.afId);
  }

  getScrollParent() {
    let el = this.selfRef.current;
    while (el = el.parentElement) {
      const overflowY = window.getComputedStyle(el).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') return el;
    }
    return window;
  }

  getScroll() {
    const {scrollParent} = this;
    const elTop = this.selfRef.current.getBoundingClientRect().top;
    if (scrollParent === window) return -elTop;
    const scrollParentTop = scrollParent.getBoundingClientRect().top;
    return scrollParentTop + scrollParent.clientTop - elTop;
  }

  setScroll(y) {
    const {scrollParent} = this;
    if (scrollParent === window) {
      const elTop = this.selfRef.current.getBoundingClientRect().top;
      const windowTop = document.documentElement.getBoundingClientRect().top;
      return window.scrollTo(0, Math.round(elTop) - windowTop + y);
    }
    scrollParent.scrollTop += y - this.getScroll();
  }

  scrollTo(i) {
    const itemEl = this.selfRef.current.children[i];
    if (!itemEl) return;
    const itemElTop = itemEl.getBoundingClientRect().top;
    const elTop = this.selfRef.current.getBoundingClientRect().top;
    this.setScroll(itemElTop - elTop);
  }

  getViewportHeight() {
    const {scrollParent} = this;
    const {innerHeight, clientHeight} = scrollParent;
    return scrollParent === window ? innerHeight : clientHeight;
  }

  updateFrame() {
    const frameBottom = this.getScroll() + this.getViewportHeight();
    const elBottom = this.selfRef.current.getBoundingClientRect().height;
    const {pageSize, length, threshold} = this.props;
    if (elBottom >= frameBottom + threshold) return;
    this.setState({size: Math.min(this.state.size + pageSize, length)});
  }

  render() {
    const {from, size} = this.state;
    const items = [];
    for (let i = 0; i < size; ++i) {
      items.push(this.props.itemRenderer(from + i, i));
    }
    return this.props.itemsRenderer(items, this.selfRef);
  }
}

List.propTypes = {
  initialIndex: PropTypes.number,
  itemRenderer: PropTypes.func,
  itemsRenderer: PropTypes.func,
  length: PropTypes.number,
  pageSize: PropTypes.number,
  threshold: PropTypes.number
};

List.defaultProps = {
  itemRenderer: (i, j) => <div key={j}>{i}</div>,
  itemsRenderer: (items, ref) => <div ref={ref}>{items}</div>,
  length: 0,
  pageSize: 10,
  threshold: 500
};

export class UniformList extends List {
  constructor(props) {
    super(props);

    this.state = {
      from: 0,
      itemHeight: this.props.itemHeight || 0,
      itemsPerRow: this.props.itemsPerRow || 1,
      size: 1
    };
  }

  componentWillReceiveProps(next) {
    let {itemsPerRow, from, size} = this.state;
    const {length} = next;
    from = Math.max(Math.min(from, this.getMaxFrom(length, itemsPerRow)), 0);
    size = Math.min(Math.max(size, 1), length - from);
    this.setState({from, size});
  }

  getMaxScrollFor(index) {
    const {itemHeight, itemsPerRow} = this.state;
    return Math.floor(index / itemsPerRow) * itemHeight;
  }

  scrollTo(index) {
    this.setScroll(this.getMaxScrollFor(index));
  }

  scrollAround(index) {
    const {itemHeight} = this.state;
    const current = this.getScroll();
    const max = this.getMaxScrollFor(index);
    if (current > max) return this.setScroll(max);
    const min = max - this.getViewportHeight() + itemHeight;
    if (current < min) this.setScroll(min);
  }

  updateFrame() {
    let {itemHeight, itemsPerRow} = this.props;

    if (itemHeight == null || itemsPerRow == null) {
      const itemEls = this.selfRef.current.children;
      if (!itemEls.length) return;

      const firstRect = itemEls[0].getBoundingClientRect();
      itemHeight = this.state.itemHeight;
      if (Math.round(firstRect.height) !== Math.round(itemHeight)) {
        itemHeight = firstRect.height;
      }
      if (!itemHeight) return;

      const firstRowBottom = Math.round(firstRect.bottom);
      itemsPerRow = 1;
      for (
        let item = itemEls[itemsPerRow];
        item && Math.round(item.getBoundingClientRect().top) < firstRowBottom;
        item = itemEls[itemsPerRow]
      ) ++itemsPerRow;
    }

    if (!itemHeight || !itemsPerRow) return;

    const {threshold} = this.props;
    const top = Math.max(0, this.getScroll() - threshold);
    const from = Math.min(
      Math.floor(top / itemHeight) * itemsPerRow,
      this.getMaxFrom(this.props.length, itemsPerRow)
    );

    const viewportHeight = this.getViewportHeight() + (threshold * 2);
    const size = Math.min(
      (Math.ceil(viewportHeight / itemHeight) + 1) * itemsPerRow,
      this.props.length - from
    );

    this.setState({itemsPerRow, from, itemHeight, size});
  }

  getMaxFrom(length, itemsPerRow) {
    return Math.max(0, length - itemsPerRow - (length % itemsPerRow));
  }

  getSpace(n) {
    return (n / this.state.itemsPerRow) * this.state.itemHeight;
  }

  render() {
    const transform = `translate(0, ${this.getSpace(this.state.from)}px)`;
    return (
      <div
        style={{position: 'relative', height: this.getSpace(this.props.length)}}
      >
        <div style={{WebkitTransform: transform, transform}}>
          {super.render()}
        </div>
      </div>
    );
  }
}

UniformList.propTypes = {
  initialIndex: PropTypes.number,
  itemHeight: PropTypes.number,
  itemRenderer: PropTypes.func,
  itemsPerRow: PropTypes.number,
  itemsRenderer: PropTypes.func,
  length: PropTypes.number,
  threshold: PropTypes.number
};

UniformList.defaultProps = {
  itemRenderer: (i, j) => <div key={j}>{i}</div>,
  itemsRenderer: (items, ref) => <div ref={ref}>{items}</div>,
  length: 0,
  threshold: 500
};

export class QuantizedHeightList extends List {
  scrollTo(unitOffset) {
    this.setScroll(this.getSpace(unitOffset));
  }

  componentDidUpdate() {
  }

  updateFrame(event) {
    const {totalHeight, threshold, unitSize} = this.props;
    // the scroll position can be negative if there's a header or other things.
    // But as far as we are concerned 0 is as high as we can scroll since there
    // is nothing to render in negative-space.
    const scroll = Math.max(0, this.getScroll());

    // If this was a scroll event and we haven't scrolled far enough since our
    // last seek, then don't issue a new seek.
    if (event && event.type === 'scroll' &&
        this._lastScroll &&
        Math.abs(scroll - this._lastScroll) < this.props.seekThreshold) {
      return;
    }
    console.log('event.type', event && event.type, '_lastScroll',
            this._lastScroll, 'new scroll', scroll);
    this._lastScroll = scroll;

    const top = Math.max(0, scroll - threshold);

    const viewportHeight = this.getViewportHeight();

    // Note that we don't have a concept of a maximum offset; it's up to the
    // seek implementation to make sure to appropriately cap what it sends us.
    const firstOffset = Math.floor(top / unitSize);
    const firstVisibleOffset = Math.floor(scroll / unitSize);
    const lastVisibleOffset = Math.ceil((scroll + viewportHeight) / unitSize);
    const lastOffset = Math.ceil((top + viewportHeight + threshold) / unitSize);
    this.props.seek(
      firstOffset,
      firstVisibleOffset - firstOffset,
      lastVisibleOffset - firstVisibleOffset,
      lastOffset - lastVisibleOffset
    );
  }

  getSpace(unitOffset) {
    return unitOffset * this.props.unitSize;
  }

  render() {
    if (!this.props.seekedData) {
      return <div></div>;
    }

    const {unitSize} = this.props;
    const items = this.props.seekedData.map((item, i) => {
      return this.props.itemRenderer(item, i, unitSize);
    });
    const container = this.props.itemsRenderer(items, this.selfRef);

    const transform =
      `translate(0, ${this.getSpace(this.props.seekedOffset)}px)`;
    return (
      <div
        style={{position: 'relative', height: this.getSpace(this.props.totalHeight)}}
      >
        <div style={{WebkitTransform: transform, transform}}>
          {container}
        </div>
      </div>
    );
  }
}

QuantizedHeightList.propTypes = {
  initialIndex: PropTypes.number,
  itemRenderer: PropTypes.func,
  itemsRenderer: PropTypes.func,
  seek: PropTypes.func,
  seekedData: PropTypes.array,
  seekedOffset: PropTypes.number,
  seekThreshold: PropTypes.number,
  threshold: PropTypes.number,
  totalHeight: PropTypes.number,
  unitSize: PropTypes.number
};

QuantizedHeightList.defaultProps = {
  itemRenderer: (i, j) => <div key={j}>{i}</div>,
  itemsRenderer: (items, ref) => <div ref={ref}>{items}</div>,
  length: 0,
  seekedData: [], // (immutable, so its reuse does not matter)
  seekedOffset: 0,
  seekThreshold: 100,
  threshold: 500,
  unitSize: 40
};