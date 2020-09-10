import React, { useEffect, useState } from 'react';

/**
 * Renders all of the items in an `EntireListView`, automatically re-rendering
 * itself whenever the list changes or items in the list are updated.
 *
 * Rendered item widgets will have the following props passed:
 * - item: The list item itself.
 * - extra: Any extra context provided as `extra` to the list.
 * - serial: The current serial of the item.  This can be used with `React.memo`
 *   or `React.PureComponent` to avoid needlessly re-rendering items which have
 *   not changed.
 * - selected: A boolean that's the result of comparing the item's id against
 *   the `selectedId` prop provided to the list.
 * - pick: Function that should be called with the item if the item is clicked
 *   on in a way that might denote selection and isn't superseded by in-widget
 *   UI.
 *
 * The list takes the following props:
 * - view: The EntireListView to render.
 * - extra: A context object to be passed as `extra` to the widget.  Not called
 *   context to avoid colliding with React's concept of context.  Not spread
 *   like {...passProps} to try and avoid weird multi-level propagation.
 * - widget or conditionalWidget: conditionalWidget is a function that takes the
 *   item and returns a widget, widget is just the same widget used the entire
 *   time.
 *
 * This previously used "react-list" which attempted to only render things into
 * the DOM when they became visible, but there wasn't much justification for
 * that and if there was, it was 4 years ago.
 */
export default function EntireList(props) {
  const view = props.view;
  const extra = props.extra;

  const [, setSerial] = useState(view.serial);

  useEffect(() => {
    view.on('complete', () => { setSerial(view.serial); });
  }, [view]);

  const renderedItems = view.items.map((item) => {
    const Widget = props.widget || props.conditionalWidget(item);

    return (
      <Widget
        key={ item.id }
        item={ item }
        extra={ extra }
        serial={ item.serial }
        selected={ props.selectedId === item.id }
        pick={ props.pick }
        />
    );
  });

  const ContainerElem = props.as || 'div';

  return (
    <ContainerElem>
      { renderedItems }
    </ContainerElem>
  );
}
