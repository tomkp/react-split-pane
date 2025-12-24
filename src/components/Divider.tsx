import type { CSSProperties } from 'react';
import type { DividerProps } from '../types';
import {
  getDividerLabel,
  getKeyboardInstructions,
} from '../utils/accessibility';
import { cn } from '../utils/classNames';

const DEFAULT_CLASSNAME = 'split-pane-divider';

/**
 * The divider component that separates panes and handles resize interactions.
 *
 * This component is automatically rendered between panes by SplitPane.
 * You can provide a custom divider via the `divider` prop on SplitPane.
 *
 * Features:
 * - Keyboard accessible (arrow keys, Home, End)
 * - Touch-friendly for mobile devices
 * - ARIA attributes for screen readers
 *
 * @example
 * ```tsx
 * // Custom divider component
 * function CustomDivider(props: DividerProps) {
 *   return (
 *     <div {...props} className="my-divider">
 *       <GripIcon />
 *     </div>
 *   );
 * }
 *
 * <SplitPane divider={CustomDivider}>
 *   <Pane>Left</Pane>
 *   <Pane>Right</Pane>
 * </SplitPane>
 * ```
 */
export function Divider(props: DividerProps) {
  const {
    direction,
    index,
    isDragging,
    disabled,
    onMouseDown,
    onTouchStart,
    onTouchEnd,
    onKeyDown,
    className,
    style,
    currentSize,
    minSize,
    maxSize,
    children,
  } = props;

  const orientation = direction === 'horizontal' ? 'vertical' : 'horizontal';

  const defaultStyle: CSSProperties = {
    flex: 'none',
    position: 'relative',
    userSelect: 'none',
    touchAction: 'none',
    ...(direction === 'horizontal'
      ? {
          width: '1px',
          cursor: disabled ? 'default' : 'col-resize',
        }
      : {
          height: '1px',
          cursor: disabled ? 'default' : 'row-resize',
        }),
    ...(isDragging && {
      cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
    }),
  };

  const combinedStyle: CSSProperties = {
    ...defaultStyle,
    ...style,
  };

  const combinedClassName = cn(
    DEFAULT_CLASSNAME,
    direction,
    isDragging && 'dragging',
    className
  );

  const label = getDividerLabel(index, direction);
  const instructions = getKeyboardInstructions(direction);

  // Don't pass Infinity to ARIA attributes - screen readers can't handle it
  const ariaValueMax =
    maxSize === undefined || maxSize === Infinity ? undefined : maxSize;

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      aria-label={label}
      aria-valuenow={currentSize}
      aria-valuemin={minSize}
      aria-valuemax={ariaValueMax}
      aria-description={instructions}
      tabIndex={disabled ? -1 : 0}
      className={combinedClassName}
      style={combinedStyle}
      onMouseDown={disabled ? undefined : onMouseDown}
      onTouchStart={disabled ? undefined : onTouchStart}
      onTouchEnd={disabled ? undefined : onTouchEnd}
      onKeyDown={disabled ? undefined : onKeyDown}
      data-divider-index={index}
    >
      {children}
    </div>
  );
}
