import { useCallback, useEffect, useRef, useState } from 'react';
import type { Direction, ResizeEvent } from '../types';
import {
  calculateDraggedSizes,
  snapToPoint,
  applyStep,
} from '../utils/calculations';

/**
 * Options for the useResizer hook.
 */
export interface UseResizerOptions {
  direction: Direction;
  sizes: number[];
  minSizes: number[];
  maxSizes: number[];
  snapPoints?: number[] | undefined;
  snapTolerance?: number | undefined;
  step?: number | undefined;
  onResizeStart?: ((event: ResizeEvent) => void) | undefined;
  onResize?: ((sizes: number[], event: ResizeEvent) => void) | undefined;
  onResizeEnd?: ((sizes: number[], event: ResizeEvent) => void) | undefined;
}

/**
 * Return type for the useResizer hook.
 */
export interface UseResizerResult {
  isDragging: boolean;
  currentSizes: number[];
  handleMouseDown: (dividerIndex: number) => (e: React.MouseEvent) => void;
  handleTouchStart: (dividerIndex: number) => (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
}

/**
 * Hook that handles mouse and touch-based resizing of panes.
 *
 * This is a low-level hook used internally by SplitPane. For most use cases,
 * you should use the SplitPane component directly.
 *
 * Features:
 * - Mouse drag support
 * - Touch support for mobile
 * - RAF-throttled updates for smooth performance
 * - Snap points support
 * - Step-based resizing
 *
 * @param options - Configuration options for the resizer
 * @returns Handlers and state for resize interactions
 */
export function useResizer(options: UseResizerOptions): UseResizerResult {
  const {
    direction,
    sizes,
    minSizes,
    maxSizes,
    snapPoints = [],
    snapTolerance = 10,
    step,
    onResizeStart,
    onResize,
    onResizeEnd,
  } = options;

  const [isDragging, setIsDragging] = useState(false);
  const [currentSizes, setCurrentSizes] = useState(sizes);

  const dragStateRef = useRef<{
    dividerIndex: number;
    startPosition: number;
    startSizes: number[];
  } | null>(null);

  const rafRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);

  // Use refs to avoid stale closures in event handlers
  const currentSizesRef = useRef(currentSizes);
  currentSizesRef.current = currentSizes;

  const onResizeEndRef = useRef(onResizeEnd);
  onResizeEndRef.current = onResizeEnd;

  // Sync sizes from props when not dragging (React 19 compatible)
  const sizesRef = useRef(sizes);
  useEffect(() => {
    if (
      !isDragging &&
      JSON.stringify(sizes) !== JSON.stringify(sizesRef.current)
    ) {
      sizesRef.current = sizes;
      setCurrentSizes(sizes);
    }
  }, [sizes, isDragging]);

  // Track mounted state for RAF cleanup
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  const handleDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!dragStateRef.current || !mountedRef.current) return;

      const { dividerIndex, startPosition, startSizes } = dragStateRef.current;
      const currentPosition = direction === 'horizontal' ? clientX : clientY;

      let delta = currentPosition - startPosition;

      // Apply step if specified
      if (step) {
        delta = applyStep(delta, step);
      }

      let newSizes = calculateDraggedSizes(
        startSizes,
        dividerIndex,
        delta,
        minSizes,
        maxSizes
      );

      // Apply snap points
      if (snapPoints.length > 0) {
        newSizes = newSizes.map((size) =>
          snapToPoint(size, snapPoints, snapTolerance)
        );
      }

      setCurrentSizes(newSizes);

      if (onResize) {
        onResize(newSizes, {
          sizes: newSizes,
          source: 'mouse',
        });
      }
    },
    [direction, step, minSizes, maxSizes, snapPoints, snapTolerance, onResize]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();

      // Always store the latest position to avoid stale closure in RAF callback
      lastPositionRef.current = { x: e.clientX, y: e.clientY };

      // Use RAF to throttle updates
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (mountedRef.current && lastPositionRef.current) {
          handleDrag(lastPositionRef.current.x, lastPositionRef.current.y);
        }
      });
    },
    [handleDrag]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();

      const touch = e.touches[0];
      if (!touch) return;

      // Always store the latest position to avoid stale closure in RAF callback
      lastPositionRef.current = { x: touch.clientX, y: touch.clientY };

      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (mountedRef.current && lastPositionRef.current) {
          handleDrag(lastPositionRef.current.x, lastPositionRef.current.y);
        }
      });
    },
    [handleDrag]
  );

  const handleMouseUp = useCallback(() => {
    if (!dragStateRef.current) return;

    // Cancel any pending RAF
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    setIsDragging(false);

    // Use refs to get latest values and avoid stale closure
    const latestSizes = currentSizesRef.current;
    const latestOnResizeEnd = onResizeEndRef.current;

    if (latestOnResizeEnd) {
      latestOnResizeEnd(latestSizes, {
        sizes: latestSizes,
        source: 'mouse',
      });
    }

    dragStateRef.current = null;
  }, []);

  const handleMouseDown = useCallback(
    (dividerIndex: number) => (e: React.MouseEvent) => {
      e.preventDefault();

      const startPosition = direction === 'horizontal' ? e.clientX : e.clientY;

      dragStateRef.current = {
        dividerIndex,
        startPosition,
        startSizes: currentSizes,
      };

      setIsDragging(true);

      if (onResizeStart) {
        onResizeStart({
          sizes: currentSizes,
          source: 'mouse',
          originalEvent: e.nativeEvent,
        });
      }
    },
    [direction, currentSizes, onResizeStart]
  );

  const handleTouchStart = useCallback(
    (dividerIndex: number) => (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      const startPosition =
        direction === 'horizontal' ? touch.clientX : touch.clientY;

      dragStateRef.current = {
        dividerIndex,
        startPosition,
        startSizes: currentSizes,
      };

      setIsDragging(true);

      if (onResizeStart) {
        onResizeStart({
          sizes: currentSizes,
          source: 'touch',
          originalEvent: e.nativeEvent,
        });
      }
    },
    [direction, currentSizes, onResizeStart]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      handleMouseUp();
    },
    [handleMouseUp]
  );

  // Set up global event listeners
  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return {
    isDragging,
    currentSizes,
    handleMouseDown,
    handleTouchStart,
    handleTouchEnd,
  };
}
