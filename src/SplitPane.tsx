import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  forwardRef,
  useState,
  useMemo,
  useImperativeHandle,
} from 'react';

import Pane, { PaneRef, stringifyStyle } from './Pane';
import Resizer, {
  RESIZER_DEFAULT_CLASSNAME,
  useStableCallback,
} from './Resizer';

function unFocus(document: Document | null, window: Window | null) {
  if (document && (document as any).selection) {
    (document as any).selection.empty();
  } else {
    try {
      window && window.getSelection()!.removeAllRanges();
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

export type Size = React.CSSProperties['width'] | React.CSSProperties['height'];

export interface SplitPaneProps {
  allowResize?: boolean;
  children: React.ReactNode;
  className?: string;
  primary?: 'first' | 'second';
  minSize?: Size;
  maxSize?: Size;
  // eslint-disable-next-line react/no-unused-prop-types
  defaultSize?: Size;
  size?: Size;
  split?: 'vertical' | 'horizontal';
  onDragStarted?: () => void;
  onDragFinished?: (dragsize: number) => void;
  onChange?: (newSize: number) => void;
  onResizerClick?: React.MouseEventHandler;
  onResizerDoubleClick?: React.MouseEventHandler;
  style?: React.CSSProperties;
  resizerStyle?: React.CSSProperties;
  paneClassName?: string;
  pane1ClassName?: string;
  pane2ClassName?: string;
  paneStyle?: React.CSSProperties;
  pane1Style?: React.CSSProperties;
  pane2Style?: React.CSSProperties;
  resizerClassName?: string;
  step?: number;
}

function getDefaultSize(
  defaultSize: Size,
  minSize: Size,
  maxSize: Size,
  draggedSize: Size
) {
  if (typeof draggedSize === 'number') {
    const min = typeof minSize === 'number' ? minSize : 0;
    const max =
      typeof maxSize === 'number' && maxSize >= 0 ? maxSize : Infinity;

    return Math.max(min, Math.min(max, draggedSize));
  }

  if (defaultSize !== undefined) {
    return defaultSize;
  }

  return minSize;
}

function removeNullChildren(children: React.ReactNode) {
  return React.Children.toArray(children).filter(c => c);
}

const defaultOptions: Partial<SplitPaneProps> = {
  allowResize: true,
  minSize: 50,
  primary: 'first',
  split: 'vertical',
  paneClassName: '',
  pane1ClassName: '',
  pane2ClassName: '',
};

export interface SplitPaneState {
  active: boolean;
  resized: boolean;
  pane1Size: string | number | undefined;
  pane2Size: string | number | undefined;
  draggedSize: number | undefined;
  position: number | undefined;
  instanceProps: {
    size: string | number | undefined;
  };
}

function getSizeUpdate(
  props: SplitPaneProps,
  state: SplitPaneState
): Partial<SplitPaneState> {
  const newState: Partial<SplitPaneState> = {};
  const options = {
    ...defaultOptions,
    ...props,
  };

  const { instanceProps } = state;

  if (instanceProps.size === options.size && options.size !== undefined) {
    return {};
  }

  const newSize =
    options.size !== undefined
      ? options.size
      : getDefaultSize(
          options.defaultSize,
          options.minSize,
          options.maxSize,
          state.draggedSize
        );

  if (options.size !== undefined) {
    newState.draggedSize = newSize !== undefined ? +newSize : undefined;
  }

  const isPanel1Primary = options.primary === 'first';

  newState[isPanel1Primary ? 'pane1Size' : 'pane2Size'] = newSize;
  newState[isPanel1Primary ? 'pane2Size' : 'pane1Size'] = undefined;

  newState.instanceProps = { size: options.size };

  return newState;
}

const SplitPane = forwardRef<PaneRef, SplitPaneProps>((props, forwardedRef) => {
  const splitPane = React.useRef<PaneRef>(null);
  const pane1 = useRef<PaneRef>(null);
  const pane2 = useRef<PaneRef>(null);

  /** make external callbacks stable */
  const onResizerClick = useStableCallback<React.MouseEventHandler>(
    props.onResizerClick
  );
  const onResizerDoubleClick = useStableCallback<React.MouseEventHandler>(
    props.onResizerDoubleClick
  );

  const getDocument = (): Document | null => {
    if (splitPane.current) {
      return splitPane.current.ownerDocument;
    }

    return null;
  };

  const getWindow = (): Window | null => {
    const document = getDocument();

    if (document) {
      // IE = parentWindow === window if no parent | all other browsers
      return (document as any).parentWindow || document.defaultView;
    }

    return null;
  };

  const getOption = <Name extends keyof SplitPaneProps>(
    name: Name
  ): SplitPaneProps[Name] | undefined => {
    if (typeof props[name] !== 'undefined') {
      return props[name];
    } else if (typeof defaultOptions[name] !== 'undefined') {
      return defaultOptions[name];
    }

    return;
  };

  // forward local ref to the forwarded ref if any
  useImperativeHandle(
    forwardedRef,
    () => {
      return splitPane.current;
    },
    [splitPane]
  );

  const [state, setState] = useState<SplitPaneState>(() => {
    const size = getOption('size');
    const defaultSize = getOption('defaultSize');
    const minSize = getOption('minSize')!;
    const maxSize = getOption('maxSize');

    const initialSize =
      size !== undefined
        ? size
        : getDefaultSize(defaultSize, minSize, maxSize, undefined);

    return {
      active: false,
      resized: false,
      draggedSize: undefined,
      position: undefined,
      pane1Size: getOption('primary') === 'first' ? initialSize : undefined,
      pane2Size: getOption('primary') === 'second' ? initialSize : undefined,

      // these are props that are needed in static functions. ie: gDSFP
      instanceProps: {
        size: props.size,
      },
    };
  });

  const onTouchStart = useCallback<React.TouchEventHandler>(
    event => {
      const allowResize = getOption('allowResize');
      const onDragStarted = getOption('onDragStarted');
      const split = getOption('split')!;

      if (allowResize) {
        unFocus(getDocument(), getWindow());

        const position =
          split === 'vertical'
            ? event.touches[0].clientX
            : event.touches[0].clientY;

        if (typeof onDragStarted === 'function') {
          onDragStarted();
        }

        setState(prevState => ({
          ...prevState,
          active: true,
          position,
        }));
      }
    },
    [setState, splitPane]
  );

  const onMouseDown = useCallback<React.MouseEventHandler>(
    event => {
      const eventWithTouches: any = {
        ...event,
        touches: [{ clientX: event.clientX, clientY: event.clientY }],
      };

      onTouchStart(eventWithTouches);
    },
    [onTouchStart]
  );

  const onTouchMove = useCallback<React.TouchEventHandler>(
    event => {
      const allowResize = getOption('allowResize')!;
      const maxSize = getOption('maxSize')!;
      const minSize = getOption('minSize')!;
      const onChange = getOption('onChange');
      const split = getOption('split')!;
      const step = getOption('step');
      const document = getDocument();
      const window = getWindow();

      if (allowResize && state.active && document && window) {
        unFocus(document, window);

        const isPrimaryFirst = getOption('primary') === 'first';
        const ref1 = isPrimaryFirst ? pane1.current : pane2.current;
        const ref2 = isPrimaryFirst ? pane2.current : pane1.current;

        if (ref1 && ref2) {
          const node1 = ref1;
          const node2 = ref2;

          if (node1.getBoundingClientRect && state.position !== undefined) {
            const width = node1.getBoundingClientRect().width;
            const height = node1.getBoundingClientRect().height;

            const current =
              split === 'vertical'
                ? event.touches[0].clientX
                : event.touches[0].clientY;

            const size = split === 'vertical' ? width : height;

            let positionDelta = state.position - current;

            if (step) {
              if (Math.abs(positionDelta) < step) {
                return;
              }
              // Integer division
              // eslint-disable-next-line no-bitwise
              positionDelta = ~~(positionDelta / step) * step;
            }

            let sizeDelta = isPrimaryFirst ? positionDelta : -positionDelta;

            const pane1Order = parseInt(
              `${window.getComputedStyle(node1).order}`,
              10
            );
            const pane2Order = parseInt(
              `${window.getComputedStyle(node2).order}`,
              10
            );

            if (pane1Order > pane2Order) {
              sizeDelta = -sizeDelta;
            }

            let newMaxSize: number | string = maxSize!;

            if (maxSize !== undefined && maxSize <= 0) {
              const pane = splitPane.current;

              if (!pane) {
                return;
              }

              newMaxSize =
                split === 'vertical'
                  ? pane.getBoundingClientRect().width + +maxSize
                  : pane.getBoundingClientRect().height + +maxSize;
            }

            let newSize = size - sizeDelta;
            const newPosition = state.position - positionDelta;

            if (newSize < minSize) {
              newSize = +minSize;
            } else if (maxSize !== undefined && newSize > newMaxSize) {
              newSize = +newMaxSize;
            } else {
              setState(prevState => ({
                ...prevState,
                position: newPosition,
                resized: true,
              }));
            }

            if (onChange) {
              onChange(newSize);
            }

            setState(prevState => ({
              ...prevState,
              draggedSize: newSize,
              [isPrimaryFirst ? 'pane1Size' : 'pane2Size']: newSize,
            }));
          }
        }
      }
    },
    [setState, state]
  );

  const onMouseMove = useCallback<React.MouseEventHandler>(
    event => {
      const eventWithTouches: any = {
        ...event,
        touches: [{ clientX: event.clientX, clientY: event.clientY }],
      };

      onTouchMove(eventWithTouches);
    },
    [onTouchMove]
  );

  const onMouseUp = useCallback<React.MouseEventHandler>(() => {
    const allowResize = getOption('allowResize')!;
    const onDragFinished = getOption('onDragFinished');

    if (allowResize && state.active) {
      if (typeof onDragFinished === 'function') {
        onDragFinished(state.draggedSize!);
      }

      setState(prevState => ({
        ...prevState,
        active: false,
      }));
    }
  }, [setState, state]);

  const disabledClass = getOption('allowResize') ? '' : 'disabled';
  const resizerClassNamesIncludingDefault = getOption('resizerClassName')
    ? `${getOption('resizerClassName')} ${RESIZER_DEFAULT_CLASSNAME}`
    : getOption('resizerClassName');

  const style = useMemo<React.CSSProperties>(() => {
    const res: React.CSSProperties = {
      display: 'flex',
      flex: 1,
      height: '100%',
      position: 'absolute',
      outline: 'none',
      overflow: 'hidden',
      MozUserSelect: 'text',
      WebkitUserSelect: 'text',
      msUserSelect: 'text',
      userSelect: 'text',
      ...getOption('style'),
    };

    const split = getOption('split')!;

    if (split === 'vertical') {
      Object.assign(res, {
        flexDirection: 'row',
        left: 0,
        right: 0,
      });
    } else {
      Object.assign(res, {
        bottom: 0,
        flexDirection: 'column',
        minHeight: '100%',
        top: 0,
        width: '100%',
      });
    }

    return res;
  }, [stringifyStyle(props.style), getOption('split')]);

  useEffect(() => {
    const document = getDocument();

    if (document) {
      document.addEventListener('mouseup', onMouseUp as any);
      document.addEventListener('mousemove', onMouseMove as any);
      document.addEventListener('touchmove', onTouchMove as any);
    }

    return () => {
      if (document) {
        document.removeEventListener('mouseup', onMouseUp as any);
        document.removeEventListener('mousemove', onMouseMove as any);
        document.removeEventListener('touchmove', onTouchMove as any);
      }
    };
  }, [splitPane, onMouseUp, onMouseMove, onTouchMove]);

  useLayoutEffect(() => {
    setState(prevState => {
      return {
        ...prevState,
        ...getSizeUpdate(props, prevState),
      };
    });
  }, [setState]);

  const classes = [
    'SplitPane',
    getOption('className'),
    getOption('split'),
    disabledClass,
  ].join(' ');

  const pane1Style = useMemo<React.CSSProperties>(() => {
    return {
      ...getOption('paneStyle'),
      ...getOption('pane1Style'),
    };
  }, [
    stringifyStyle(getOption('paneStyle')),
    stringifyStyle(getOption('pane1Style')),
  ]);

  const pane2Style = useMemo<React.CSSProperties>(() => {
    return {
      ...getOption('paneStyle'),
      ...getOption('pane2Style'),
    };
  }, [
    stringifyStyle(getOption('paneStyle')),
    stringifyStyle(getOption('pane2Style')),
  ]);

  const pane1Classes = [
    'Pane1',
    getOption('paneClassName')!,
    getOption('pane1ClassName'),
  ].join(' ');
  const pane2Classes = [
    'Pane2',
    getOption('paneClassName')!,
    getOption('pane2ClassName'),
  ].join(' ');
  const notNullChildren = removeNullChildren(props.children);

  return (
    <div className={classes} ref={splitPane} style={style}>
      <Pane
        className={pane1Classes}
        key="pane1"
        ref={pane1}
        size={state.pane1Size}
        split={getOption('split')!}
        style={pane1Style}
      >
        {notNullChildren[0]}
      </Pane>
      <Resizer
        className={disabledClass}
        onClick={onResizerClick}
        onDoubleClick={onResizerDoubleClick}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchEnd={(onMouseUp as unknown) as React.TouchEventHandler}
        key="resizer"
        resizerClassName={resizerClassNamesIncludingDefault}
        split={getOption('split')!}
        style={getOption('resizerStyle')}
      />
      <Pane
        className={pane2Classes}
        key="pane2"
        ref={pane2}
        size={state.pane2Size}
        split={getOption('split')!}
        style={pane2Style}
      >
        {notNullChildren[1]}
      </Pane>
    </div>
  );
});

export default SplitPane;
