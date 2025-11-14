import { CSSProperties } from 'react';
import { DividerProps } from '../types';
import { getDividerLabel, getKeyboardInstructions } from '../utils/accessibility';

const DEFAULT_CLASSNAME = 'split-pane-divider';

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
          width: '11px',
          cursor: disabled ? 'default' : 'col-resize',
          marginLeft: '-5px',
          marginRight: '-5px',
        }
      : {
          height: '11px',
          cursor: disabled ? 'default' : 'row-resize',
          marginTop: '-5px',
          marginBottom: '-5px',
        }),
    ...(isDragging && {
      cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
    }),
  };

  const combinedStyle: CSSProperties = {
    ...defaultStyle,
    ...style,
  };

  const combinedClassName = [DEFAULT_CLASSNAME, direction, className]
    .filter(Boolean)
    .join(' ');

  const label = getDividerLabel(index, direction);
  const instructions = getKeyboardInstructions(direction);

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      aria-label={label}
      aria-valuenow={currentSize}
      aria-valuemin={minSize}
      aria-valuemax={maxSize}
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
