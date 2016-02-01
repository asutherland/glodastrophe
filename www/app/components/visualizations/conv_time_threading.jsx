define(function (require) {
'use strict';

var React = require('react');

var d3_scale = require('d3-scale');
var d3_hierarchy = require('d3-hierarchy');

/**
 * Given the conversation tidbits representation where each message references
 * its parent via parentIndex, build the { name/whatever, children } recursive
 * rep that the d3 cluster algorithm wants.
 */
function deriveConvHierarchy(tidbits) {
  let hierObjs = new Array(tidbits.length);
  for (let i = 0; i < tidbits.length; i++) {
    let tidbit = tidbits[i];
    let curObj = hierObjs[i] = {
      id: tidbit.id,
      // propagate things our visualization wants to key on
      date: tidbit.date.valueOf(),
      isRead: tidbit.isRead,
      isStarred: tidbit.isStarred,
      // and the hierarchy-mandated list of children
      children: []
    };
    if (i) {
      let parentHier = hierObjs[tidbit.parentIndex];
      parentHier.children.push(curObj);
    }
  }

  console.log('root for', tidbits.length, hierObjs[0], 'from', tidbits);

  return hierObjs[0];
}

var ConvTimeThreading = React.createClass({
  render: function() {
    let conv = this.props.conv;

    let fullHeight = 40;
    let fullWidth = this.props.widthBudget;
    let padding = 2;
    let height = fullHeight - padding * 2;
    let width = fullWidth - padding * 2;

    // -- generate cluster
    // Note that we want this oriented horizontally, so width/height and x/y
    // get flipped.
    let cluster = d3_hierarchy.cluster()
      .size([height, width]);
    let nodes = cluster.nodes(deriveConvHierarchy(conv.messageTidbits));

    // - X position fixup based on time.
    // The nodes have been laid out with a strict graph relationship.  But we
    // fancy ourselves clever and/or just think it would be cool to have the x
    // position determined by a logarithmic time mapping.  Because children
    // must come after their parent, we believe this to be sufficient to not be
    // a total mess.

    var now = Date.now();
    const DAY_MILLIS = 1000 * 60 * 60 * 24;
    const WEEK_MILLIS = 7 * DAY_MILLIS;
    const YEAR_MILLIS = 365 * DAY_MILLIS;
    var timePivots = [
      now - 10 * YEAR_MILLIS,
      now - 3 * YEAR_MILLIS,
      now - YEAR_MILLIS,
      now - 12 * WEEK_MILLIS,
      now - 4 * WEEK_MILLIS,
      now - WEEK_MILLIS,
      now
    ];
    var timePixOffsets = [
      width * 0, // 10 years ago (7 years: 5%)
      width * 0.05, // 3 years ago (2 years: 5%)
      width * 0.1, // 1 year ago (9 months: 15%)
      width * 0.25, // 3 months ago (2 months: 15%)
      width * 0.4, // 1 month ago (3 weeks: 30%)
      width * 0.7, // 1 week ago (1 week: 30%)
      width
    ];

    var xScale = d3_scale.scaleLinear()
      .domain(timePivots)
      .range(timePixOffsets)
      .clamp(true);

    for (let node of nodes) {
      node.y = xScale(node.date);
    }

    let links = cluster.links(nodes);

    // -- generate the actual graphics
    let svgLinks = links.map((link) => {
      // and again, x/y are flipped in this layout.
      return (
        <line
           className='conv-time-threading-link'
           key={ link.source.id + '-' + link.target.id }
           strokeWidth={ 1 }
           x1={ link.source.y } x2={ link.target.y }
           y1={ link.source.x } y2={ link.target.x } />
      );
    });

    let svgNodes = nodes.map((node) => {
      // as noted above, we're swapping x/y with the layout.
      let transform = 'translate(' + node.y + ',' + node.x + ')';
      let useStyle;
      if (node.isStarred) {
        useStyle = 'conv-time-threading-starred';
      } else if (node.isRead) {
        useStyle = 'conv-time-threading-read';
      } else {
        useStyle = 'conv-time-threading-unread';
      }
      return (
        <g
          className='conv-time-threading-node-g'
          key={ node.id }
          transform={ transform }
          >
          <circle
            className={ useStyle }
            r={ 1.5 }
            />
        </g>
      );
    });

    let paddingTransform = `translate(${padding},${padding})`;
    return (
      <svg width={ fullWidth } height={ fullHeight }>
        <g transform={ paddingTransform }>
          { svgLinks }
          { svgNodes }
        </g>
      </svg>
    );
  }
});

return ConvTimeThreading;
});
