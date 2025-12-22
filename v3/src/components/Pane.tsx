import type { CSSProperties } from 'react';
import { forwardRef } from 'react';
import type { PaneProps } from '../types';

const DEFAULT_CLASSNAME = 'split-pane-pane';

export const Pane = forwardRef<HTMLDivElement, PaneProps>(function Pane(
  props,
  ref
) {
  const {
    className,
    style,
    children,
    // These props are extracted but used by parent SplitPane
    defaultSize: _defaultSize,
    size: _size,
    minSize: _minSize,
    maxSize: _maxSize,
    collapsible: _collapsible,
    collapsed: _collapsed,
    onCollapse: _onCollapse,
    ...rest
  } = props;

  const defaultStyle: CSSProperties = {
    position: 'relative',
    outline: 'none',
    overflow: 'auto',
    flex: 'none',
  };

  const combinedStyle: CSSProperties = {
    ...defaultStyle,
    ...style,
  };

  const combinedClassName = [DEFAULT_CLASSNAME, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      className={combinedClassName}
      style={combinedStyle}
      data-pane="true"
      {...rest}
    >
      {children}
    </div>
  );
});
