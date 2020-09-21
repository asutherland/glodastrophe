import React, { useCallback } from 'react';

import { timeMonth, timeDay } from 'd3-time';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import { cluster as d3_cluster, hierarchy as d3_hierarchy } from 'd3-hierarchy';

/**
 * A logarithmic-ish calendar view.  We take the traditional per-month calendar
 * display of 1-cell-per-day, 7-days-per-row as the core visualization.  We do
 * a small multiples thing as we move further back in time, scaling the
 * calendars down.  So where the most recent 2 months (which handles month
 * transitions at the cost of a lot of wasted space at the start of a month)
 * would be 1-per-row, as we go back in time, we halve the size, allowing 4
 * months where previously only one fit.  And at the next halving, 16.
 *
 * We render this using HTML Canvas because:
 * - This visualization is anchored to "now", so every time we render this
 *   visualization, we intend for the layout to be identical to every other
 *   instance of the visualization.  Only the days on which there's messages
 *   will there be any visual difference, and these should generally be quite
 *   sparse.
 * - The logarithmic/small multiples visualization style results in a great
 *   number of visual cells, most of which will have zero values, and therefore
 *   we can pre-render the base zero condition and paint over only what needs
 *   to change.
 * - While this could all be done with SVG and cloned trees/documents, the
 *   resulting number of DOM nodes would be quite high.  I'm not actually as
 *   concerned about the rendering performance as I am about the impact on the
 *   devtools inspector and accessibility trees exposed to screen readers.
 *
 * For month tiling, we assume a reading direction of top-to-bottom followed by
 * left to right.  So for full-size the current month is rightmost and last
 * month is to its left.  Then when we get to the half-months, the preceding
 * month (2 months ago) is the bottom month and its preceding month (3 months
 * ago) is above it.  This may need to be revised, but it's also likely that no
 * mapping will actually be intuitive and hovers will be essential.
 **/

/** How many full-size months should we fully display. */
const FULL_MONTHS = 2;
/** How many half-size (so 4 to a full month) should we display? */
const HALF_MONTHS = 6;
/** How many quarter-size (so 16 to a full month) should we display? */
const QTR_MONTHS = 16;
// Right now, that's 24 months above, which is 2 years.
const TOTAL_MONTHS = FULL_MONTHS + HALF_MONTHS + QTR_MONTHS;

/**
 * How many pixels in a full size month's day cell.  A single cell is also the
 * intra-month padding.
 *
 * Month widths plus padding for the below:
 * - Full: 32 ((7 + 1) * 4)
 * - Half: 16 ((7 + 1) * 2)
 * - Qtr:   8 ((7 + 1) * 1)
 *
 * Month heights, where we must always allow 6 content rows.
 * - Full: 28 ((6 + 1) * 4)
 */
const FULL_CELL_PX = 4;
const HALF_CELL_PX = 2;
const QTR_CELL_PX = 1;
const PADDING_PX = 1;
const DAYS_IN_WEEK = 7;
const GAP_CELLS = 1;
const MONTH_WIDTH_CELLS = DAYS_IN_WEEK + GAP_CELLS;
const MAX_WEEK_ROWS = 6;
const MONTH_HEIGHT_CELLS = MAX_WEEK_ROWS + GAP_CELLS;

const BLANK_CELL_FILL_COLOR = '#f4f4f4';
const BLANK_CELL_STROKE_COLOR = '#e8e8e8';
const CELL_PX_SIZE_STROKE_THRESH = 4;

let gLayout = null;

function generateLayout() {
  const scale = window.devicePixelRatio;
  const thisMonth = timeMonth();

  const months = new Array();
  function makeMonth(monthsAgo, leftOff, top, cellSize) {
    const firstDay = timeMonth.offset(thisMonth, -monthsAgo);
    const nextMonth = timeMonth.offset(firstDay, 1);
    // For the current month, there are only enough days to get through today!
    const numDays = monthsAgo ? timeDay.count(firstDay, nextMonth)
                              : timeDay().getDate();
    months.push({
      monthsAgo,
      firstDay,
      numDays,
      leftEdgeFromRight: leftOff,
      topEdge: top,
      cellSize,
    });
  }

  let leftEdgeFromRight = -HALF_CELL_PX;
  let topEdge = PADDING_PX;

  let monthsAgo = 0;
  // # decide where to put the months
  // (The logic below could obviously be further parameterized but this seems
  // sorta readable this way?)
  // ## Full
  for (let iFull = 0; iFull < FULL_MONTHS; iFull++, monthsAgo++) {
    leftEdgeFromRight += MONTH_WIDTH_CELLS * FULL_CELL_PX;

    makeMonth(monthsAgo, leftEdgeFromRight, topEdge, FULL_CELL_PX);
  }

  // ## Half
  for (let iHalf = 0; iHalf < HALF_MONTHS; iHalf++, monthsAgo++) {
    // Every two, move further left.
    if (iHalf % 2 === 0) {
      leftEdgeFromRight += MONTH_WIDTH_CELLS * HALF_CELL_PX;
    }
    // The 1st (0th) goes at the bottom, the 2nd (1th) goes at the top.
    topEdge = (1 - (iHalf % 2)) * MONTH_HEIGHT_CELLS * HALF_CELL_PX;

    makeMonth(monthsAgo, leftEdgeFromRight, topEdge, HALF_CELL_PX);
  }

  // ## Quarter
  for (let iQtr = 0; iQtr < QTR_MONTHS; iQtr++, monthsAgo++) {
    // Every four, move further left.
    if (iQtr % 4 === 0) {
      leftEdgeFromRight += MONTH_WIDTH_CELLS * QTR_CELL_PX;
    }
    // The 1st (0th) goes at the bottom, the 2nd (1th) goes at the top.
    topEdge = (3 - (iQtr % 4)) * MONTH_HEIGHT_CELLS * QTR_CELL_PX;

    makeMonth(monthsAgo, leftEdgeFromRight, topEdge, QTR_CELL_PX);
  }
  //console.log('months', months);

  // Finalize layout. (these are pre-pixel ratio scaling)
  const width = leftEdgeFromRight + 2 * PADDING_PX;
  const height = MONTH_HEIGHT_CELLS * FULL_CELL_PX + 2 * PADDING_PX;

  // # Draw the background
  const baseCanvas = document.createElement('canvas');
  const ctx = baseCanvas.getContext('2d');

  // the CSS size is in CSS pixels and doesn't get scaled.
  baseCanvas.style.width = `${width}px`;
  baseCanvas.style.height = `${height}px`;

  // the canvas size needs to compensate for CSS pixel size.
  baseCanvas.width = Math.floor(scale * width);
  baseCanvas.height = Math.floor(scale * height);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(scale, scale);
  //ctx.translate(0.5, 0.5);
  ctx.fillStyle = BLANK_CELL_FILL_COLOR;
  ctx.strokeStyle = BLANK_CELL_STROKE_COLOR;
  ctx.lineWidth = 1;

  for (const month of months) {
    let leftX = width - month.leftEdgeFromRight;
    for (let iDay = 0, dow=month.firstDay.getDay(),
           x = leftX + dow * month.cellSize,
           y = month.topEdge;
         iDay < month.numDays;
         iDay++, dow=(dow + 1) % 7, x += month.cellSize) {
      // Each time the dow wraps back to 0 we increment y, but not if this is
      // the first day.
      if (iDay && dow === 0) {
        y += month.cellSize;
        x = leftX;
      }

      ctx.fillRect(x, y, month.cellSize, month.cellSize);
      if (month.cellSize >= CELL_PX_SIZE_STROKE_THRESH) {
        ctx.strokeRect(x, y, month.cellSize, month.cellSize);
      }
    }
  }

  return {
    thisMonth,
    months,
    baseCanvas,
    colorScale: scaleSequential(interpolateBlues).domain([-5, 10]),
    // this is different than the baseCanvas width which is scaled
    width,
    height,
  };
}

function renderSpecificFromLayout(
    { thisMonth, months, baseCanvas, colorScale, width, height },
    data, canvas) {
  if (!canvas) {
    return;
  }

  const scale = window.devicePixelRatio;

  // A map whose keys are quantized days and whose values are { month, count }
  // where month is a month from `months`.
  const dayCounts = new Map();

  for (const item of data) {
    const qday = timeDay(item.date);

    let dayInfo = dayCounts.get(qday.valueOf());
    if (!dayInfo) {
      const monthsAgo = timeMonth.count(qday, thisMonth);
      const month = months[monthsAgo];
      // Just ignore months that are older than our visualization covers!
      if (month) {
        dayInfo = { qday, month, count: 1 };
        dayCounts.set(qday.valueOf(), dayInfo);
      }
    } else {
      dayInfo.count++;
    }
  }

  const ctx = canvas.getContext('2d');

  // the CSS size is in CSS pixels and doesn't get scaled.
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  // the canvas size needs to compensate for CSS pixel size.
  canvas.width = Math.floor(scale * width);
  canvas.height = Math.floor(scale * height);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // blit the pre-rendered image which is 1:1 before engaging scaling.
  ctx.drawImage(baseCanvas, 0, 0);
  ctx.scale(scale, scale);

  ctx.lineWidth = 1;
  //ctx.translate(0.5, 0.5);

  for (const { qday, month, count } of dayCounts.values()) {
    const cx = qday.getDay() * month.cellSize;
    const row = Math.floor((month.firstDay.getDay() + qday.getDate() - 1) / 7);
    const cy = row * month.cellSize;
    ctx.fillStyle = colorScale(count);
    ctx.fillRect(
      width - month.leftEdgeFromRight + cx,
      month.topEdge + cy,
      month.cellSize,
      month.cellSize);
    if (month.cellSize >= CELL_PX_SIZE_STROKE_THRESH) {
      ctx.strokeStyle = colorScale(count + 1);
      ctx.strokeRect(
        width - month.leftEdgeFromRight + cx,
        month.topEdge + cy,
        month.cellSize, month.cellSize);
    }
  }
}

export default function ConvLogCalendar(props) {
  const canvasRef = useCallback(canvas => {
    if (!gLayout) {
      gLayout = generateLayout();
    }
    renderSpecificFromLayout(gLayout, props.data, canvas);
  }, []);

  return (
    <canvas ref={canvasRef}>
    </canvas>
  );
}
