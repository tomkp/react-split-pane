import type { CSSProperties } from 'react';
import { forwardRef } from 'react';
import type { PaneProps } from '../types';
import { cn } from '../utils/classNames';

const DEFAULT_CLASSNAME = 'split-pane-pane';

/**
 * A pane component that must be used as a direct child of SplitPane.
 *
 * Panes can have size constraints and can be either controlled (with `size`)
 * or uncontrolled (with `defaultSize`).
 *
 * @example
 * ```tsx
 * // Uncontrolled with constraints
 * <Pane minSize="100px" maxSize="500px" defaultSize="300px">
 *   Content here
 * </Pane>
 *
 * // Controlled
 * <Pane size={sizes[0]} minSize={100}>
 *   Content here
 * </Pane>
 *
 * // Percentage-based sizing
 * <Pane defaultSize="25%" minSize="10%">
 *   Sidebar
 * </Pane>
 * ```
 */
export const Pane = forwardRef<HTMLDivElement, PaneProps>(
  function Pane(props, ref) {
    const {
      className,
      style,
      children,
      // These props are extracted but used by parent SplitPane
      defaultSize: _defaultSize,
      size: _size,
      minSize: _minSize,
      maxSize: _maxSize,
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

    const combinedClassName = cn(DEFAULT_CLASSNAME, className);

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
  }
);
