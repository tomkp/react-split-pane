import React, { forwardRef, useCallback, useMemo, useRef } from 'react';
import { stringifyStyle } from './Pane';

export const RESIZER_DEFAULT_CLASSNAME = 'Resizer';

export interface ResizerProps {
  className: string;
  onClick?: React.MouseEventHandler;
  onDoubleClick?: React.MouseEventHandler;
  onMouseDown: React.MouseEventHandler;
  onTouchStart: React.TouchEventHandler;
  onTouchEnd: React.TouchEventHandler;
  resizerClassName?: string;
  split: string;
  style?: React.CSSProperties;
}

export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T | undefined
): T {
  const ref = useRef<T | undefined>();
  ref.current = callback;

  return useCallback<T>(
    ((...args: any[]) => {
      if (ref.current) {
        ref.current(...args);
      }

      return;
    }) as any,
    [ref]
  );
}

const Resizer = forwardRef<HTMLSpanElement, ResizerProps>(
  (props, forwardedRef) => {
    const stableClick = useStableCallback(props.onClick);
    const hasClick = !!props.onClick;

    const onClick = useCallback<React.MouseEventHandler>(
      event => {
        if (hasClick) {
          event.preventDefault();
          stableClick(event);
        }
      },
      [stableClick, hasClick]
    );

    const stableDoubleClick = useStableCallback(props.onDoubleClick);
    const hasDoubleClick = !!props.onDoubleClick;

    const onDoubleClick = useCallback<React.MouseEventHandler>(
      event => {
        if (hasDoubleClick) {
          event.preventDefault();
          stableDoubleClick(event);
        }
      },
      [stableDoubleClick, hasDoubleClick]
    );

    const onMouseDown = useStableCallback(props.onMouseDown);

    const stableTouchEnd = useStableCallback(props.onTouchEnd);

    const onTouchEnd = useCallback<React.TouchEventHandler>(
      event => {
        event.preventDefault();
        stableTouchEnd(event);
      },
      [stableTouchEnd]
    );

    const stableTouchStart = useStableCallback(props.onTouchStart);

    const onTouchStart = useCallback<React.TouchEventHandler>(
      event => {
        event.preventDefault();
        stableTouchStart(event);
      },
      [stableTouchStart]
    );

    const className = [
      props.resizerClassName || RESIZER_DEFAULT_CLASSNAME,
      props.split,
      props.className,
    ].join(' ');

    const style = useMemo(() => {
      return props.style;
    }, [stringifyStyle(props.style)]);

    return (
      <span
        role="presentation"
        className={className}
        style={style}
        ref={forwardedRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      />
    );
  }
);

export default Resizer;
