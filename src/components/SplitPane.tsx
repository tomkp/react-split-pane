import type { CSSProperties, ReactElement } from 'react';
import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { SplitPaneProps, PaneProps, ResizeEvent } from '../types';
import { Pane } from './Pane';
import { Divider } from './Divider';
import { useResizer } from '../hooks/useResizer';
import { useKeyboardResize } from '../hooks/useKeyboardResize';
import { convertToPixels, distributeSizes } from '../utils/calculations';
import { cn } from '../utils/classNames';

const DEFAULT_CLASSNAME = 'split-pane';
const MIN_PANES = 2;

/**
 * A flexible split pane component that allows resizable pane layouts.
 *
 * Supports horizontal (side-by-side) and vertical (stacked) layouts with
 * mouse, touch, and keyboard interactions. Fully accessible with ARIA attributes.
 *
 * @example
 * ```tsx
 * // Basic horizontal split
 * <SplitPane direction="horizontal">
 *   <Pane minSize="200px" defaultSize="300px">
 *     <Sidebar />
 *   </Pane>
 *   <Pane>
 *     <MainContent />
 *   </Pane>
 * </SplitPane>
 *
 * // Controlled mode with state
 * const [sizes, setSizes] = useState([300, 500]);
 * <SplitPane onResize={setSizes}>
 *   <Pane size={sizes[0]}>Left</Pane>
 *   <Pane size={sizes[1]}>Right</Pane>
 * </SplitPane>
 * ```
 */
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
  const prevContainerSizeRef = useRef(0);

  // Extract pane configuration from children - memoized to avoid recreating on every render
  const paneConfigs = useMemo(() => {
    const paneElements = Children.toArray(children).filter(
      (child): child is ReactElement<PaneProps> =>
        typeof child === 'object' && child !== null && 'props' in child
    );

    return paneElements.map((pane) => ({
      props: pane.props,
      size: pane.props.size,
      defaultSize: pane.props.defaultSize,
      minSize: pane.props.minSize ?? 0,
      maxSize: pane.props.maxSize ?? Infinity,
    }));
  }, [children]);

  const paneCount = paneConfigs.length;
  const warnedRef = useRef(false);

  // Warn once if fewer than 2 panes
  if (paneCount < MIN_PANES && !warnedRef.current) {
    warnedRef.current = true;
    console.warn(
      `SplitPane requires at least ${MIN_PANES} Pane children. Received ${paneCount}.`
    );
  }

  // Calculate min/max sizes from pane configs
  const { minSizes, maxSizes } = useMemo(() => {
    if (containerSize === 0) {
      return {
        minSizes: new Array(paneCount).fill(0),
        maxSizes: new Array(paneCount).fill(Infinity),
      };
    }

    const mins: number[] = [];
    const maxs: number[] = [];

    paneConfigs.forEach((config) => {
      mins.push(convertToPixels(config.minSize, containerSize));
      maxs.push(
        config.maxSize === Infinity
          ? Infinity
          : convertToPixels(config.maxSize, containerSize)
      );
    });

    return { minSizes: mins, maxSizes: maxs };
  }, [containerSize, paneCount, paneConfigs]);

  // Calculate initial sizes from pane configs
  const calculateInitialSizes = useCallback(
    (containerSz: number): number[] => {
      if (containerSz === 0) {
        return new Array(paneCount).fill(0);
      }

      // First pass: calculate sizes for panes with explicit sizes
      const sizes: (number | null)[] = paneConfigs.map((config) => {
        const paneSize = config.size ?? config.defaultSize;
        if (paneSize !== undefined) {
          return convertToPixels(paneSize, containerSz);
        }
        return null; // Mark as needing auto-size
      });

      // Calculate remaining space and distribute to auto-sized panes
      const explicitTotal = sizes.reduce<number>(
        (sum, size) => sum + (size ?? 0),
        0
      );
      const autoSizedCount = sizes.filter((s) => s === null).length;
      const remainingSpace = containerSz - explicitTotal;
      const autoSize = autoSizedCount > 0 ? remainingSpace / autoSizedCount : 0;

      // Second pass: fill in auto-sized panes
      return sizes.map((size) => (size === null ? autoSize : size));
    },
    [paneCount, paneConfigs]
  );

  const [paneSizes, setPaneSizes] = useState<number[]>(() =>
    calculateInitialSizes(containerSize)
  );

  // Handle container size changes - update sizes proportionally
  // Using a ref comparison to avoid effect dependency issues
  const handleContainerSizeChange = useCallback(
    (newContainerSize: number) => {
      const prevSize = prevContainerSizeRef.current;
      prevContainerSizeRef.current = newContainerSize;

      if (newContainerSize === 0) return;

      setPaneSizes((currentSizes) => {
        // If sizes are uninitialized or pane count changed
        if (
          currentSizes.every((s) => s === 0) ||
          currentSizes.length !== paneCount
        ) {
          return calculateInitialSizes(newContainerSize);
        }

        // If container size changed, distribute proportionally
        if (prevSize > 0 && prevSize !== newContainerSize) {
          return distributeSizes(currentSizes, newContainerSize);
        }

        // First measurement - use initial sizes
        if (prevSize === 0) {
          return calculateInitialSizes(newContainerSize);
        }

        return currentSizes;
      });
    },
    [paneCount, calculateInitialSizes]
  );

  // Measure container size with ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSizeFromRect = (rect: { width: number; height: number }) => {
      const size = direction === 'horizontal' ? rect.width : rect.height;
      if (size > 0) {
        setContainerSize(size);
        handleContainerSizeChange(size);
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        updateSizeFromRect(entry.contentRect);
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [direction, handleContainerSizeChange]);

  // Handle resize callback
  const handleResize = useCallback(
    (newSizes: number[], event: ResizeEvent) => {
      setPaneSizes(newSizes);
      onResize?.(newSizes, event);
    },
    [onResize]
  );

  // Resizer hook
  const {
    isDragging,
    currentSizes,
    handleMouseDown,
    handleTouchStart,
    handleTouchEnd,
  } = useResizer({
    direction,
    sizes: paneSizes,
    minSizes,
    maxSizes,
    snapPoints,
    snapTolerance,
    step,
    onResizeStart,
    onResize: handleResize,
    onResizeEnd,
  });

  // Keyboard resize hook
  const { handleKeyDown } = useKeyboardResize({
    direction,
    sizes: currentSizes,
    minSizes,
    maxSizes,
    step,
    onResize: handleResize,
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

  const containerClassName = cn(DEFAULT_CLASSNAME, direction, className);

  // Render panes and dividers
  const renderChildren = () => {
    if (paneCount < MIN_PANES) {
      return null;
    }

    const elements: JSX.Element[] = [];

    paneConfigs.forEach((config, index) => {
      const paneSize = currentSizes[index] ?? 0;

      const paneStyle: CSSProperties = {
        ...(direction === 'horizontal'
          ? { width: `${paneSize}px`, height: '100%' }
          : { height: `${paneSize}px`, width: '100%' }),
        ...config.props.style,
      };

      // Render pane
      elements.push(
        <Pane key={`pane-${index}`} {...config.props} style={paneStyle}>
          {config.props.children}
        </Pane>
      );

      // Render divider (except after last pane)
      if (index < paneCount - 1) {
        const DividerComponent = CustomDivider ?? Divider;
        const dividerMinSize = minSizes[index];
        const dividerMaxSize = maxSizes[index];

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
            minSize={dividerMinSize}
            maxSize={dividerMaxSize === Infinity ? undefined : dividerMaxSize}
          />
        );
      }
    });

    return elements;
  };

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      style={containerStyle}
    >
      {containerSize > 0 && renderChildren()}
    </div>
  );
}
