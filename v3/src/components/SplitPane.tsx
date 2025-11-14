import {
  Children,
  CSSProperties,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SplitPaneProps, PaneProps, ResizeEvent } from '../types';
import { Pane } from './Pane';
import { Divider } from './Divider';
import { useResizer } from '../hooks/useResizer';
import { useKeyboardResize } from '../hooks/useKeyboardResize';
import { convertToPixels, distributeSizes } from '../utils/calculations';

const DEFAULT_CLASSNAME = 'split-pane';

export function SplitPane(props: SplitPaneProps) {
  const {
    direction = 'horizontal',
    resizable = true,
    snapPoints,
    snapTolerance = 10,
    step,
    onResizeStart,
    onResize,
    onResizeEnd,
    className,
    style,
    divider: CustomDivider,
    dividerStyle,
    dividerClassName,
    children,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(0);

  // Extract pane configuration from children
  const paneElements = Children.toArray(children).filter(
    (child): child is ReactElement<PaneProps> =>
      typeof child === 'object' && child !== null && 'props' in child
  );

  const paneCount = paneElements.length;

  // Calculate initial sizes, minSizes, and maxSizes
  const getPaneSizes = useCallback(() => {
    if (containerSize === 0) {
      return {
        sizes: new Array(paneCount).fill(0),
        minSizes: new Array(paneCount).fill(0),
        maxSizes: new Array(paneCount).fill(Infinity),
      };
    }

    const sizes: number[] = [];
    const minSizes: number[] = [];
    const maxSizes: number[] = [];

    paneElements.forEach((pane) => {
      const { size, defaultSize, minSize = 0, maxSize = Infinity } = pane.props;

      // Use controlled size if available, otherwise defaultSize, otherwise equal distribution
      const paneSize = size ?? defaultSize ?? containerSize / paneCount;
      sizes.push(convertToPixels(paneSize, containerSize));
      minSizes.push(convertToPixels(minSize, containerSize));
      maxSizes.push(
        maxSize === Infinity ? Infinity : convertToPixels(maxSize, containerSize)
      );
    });

    return { sizes, minSizes, maxSizes };
  }, [containerSize, paneCount, paneElements]);

  const { sizes: initialSizes, minSizes, maxSizes } = getPaneSizes();

  const [paneSizes, setPaneSizes] = useState(initialSizes);

  // Update sizes when container size changes
  useEffect(() => {
    if (containerSize === 0) return;

    const { sizes } = getPaneSizes();

    // Only update if we don't have valid sizes yet
    if (paneSizes.every(s => s === 0) || paneSizes.length !== sizes.length) {
      setPaneSizes(sizes);
    } else {
      // Distribute existing sizes proportionally
      const totalPaneSize = paneSizes.reduce((sum, s) => sum + s, 0);
      if (totalPaneSize !== containerSize && totalPaneSize > 0) {
        const distributed = distributeSizes(paneSizes, containerSize);
        setPaneSizes(distributed);
      }
    }
  }, [containerSize, getPaneSizes, paneSizes]);

  // Measure container size
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const size = direction === 'horizontal' ? rect.width : rect.height;
      setContainerSize(size);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [direction]);

  // Resizer hook
  const { isDragging, currentSizes, handleMouseDown, handleTouchStart, handleTouchEnd } =
    useResizer({
      direction,
      sizes: paneSizes,
      minSizes,
      maxSizes,
      snapPoints,
      snapTolerance,
      step,
      onResizeStart,
      onResize: useCallback(
        (newSizes: number[], event: ResizeEvent) => {
          setPaneSizes(newSizes);
          onResize?.(newSizes, event);
        },
        [onResize]
      ),
      onResizeEnd,
    });

  // Keyboard resize hook
  const { handleKeyDown } = useKeyboardResize({
    direction,
    sizes: currentSizes,
    minSizes,
    maxSizes,
    step,
    onResize: useCallback(
      (newSizes: number[], event: ResizeEvent) => {
        setPaneSizes(newSizes);
        onResize?.(newSizes, event);
      },
      [onResize]
    ),
    onResizeEnd,
  });

  // Container styles
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    ...style,
  };

  const containerClassName = [DEFAULT_CLASSNAME, direction, className]
    .filter(Boolean)
    .join(' ');

  // Render panes and dividers
  const renderChildren = () => {
    const elements: JSX.Element[] = [];

    paneElements.forEach((pane, index) => {
      const paneSize = currentSizes[index] ?? 0;

      const paneStyle: CSSProperties = {
        ...(direction === 'horizontal'
          ? { width: `${paneSize}px`, height: '100%' }
          : { height: `${paneSize}px`, width: '100%' }),
        ...pane.props.style,
      };

      // Render pane
      elements.push(
        <Pane key={`pane-${index}`} {...pane.props} style={paneStyle}>
          {pane.props.children}
        </Pane>
      );

      // Render divider (except after last pane)
      if (index < paneCount - 1) {
        const DividerComponent = CustomDivider ?? Divider;

        elements.push(
          <DividerComponent
            key={`divider-${index}`}
            direction={direction}
            index={index}
            isDragging={isDragging}
            disabled={!resizable}
            onMouseDown={handleMouseDown(index)}
            onTouchStart={handleTouchStart(index)}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown(index)}
            className={dividerClassName}
            style={dividerStyle}
            currentSize={paneSize}
            minSize={minSizes[index]}
            maxSize={maxSizes[index]}
          />
        );
      }
    });

    return elements;
  };

  return (
    <div ref={containerRef} className={containerClassName} style={containerStyle}>
      {containerSize > 0 && renderChildren()}
    </div>
  );
}
