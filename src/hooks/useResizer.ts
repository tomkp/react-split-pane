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
  handlePointerDown: (dividerIndex: number) => (e: React.PointerEvent) => void;
}

/**
 * Hook that handles pointer-based resizing of panes.
 *
 * This is a low-level hook used internally by SplitPane. For most use cases,
 * you should use the SplitPane component directly.
 *
 * Features:
 * - Unified pointer events (handles mouse, touch, and pen input)
 * - Pointer capture for reliable drag behavior
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
    pointerId: number;
    pointerType: 'mouse' | 'touch' | 'pen';
    element: HTMLElement | null;
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

      const { dividerIndex, startPosition, startSizes, pointerType } =
        dragStateRef.current;
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
          source: 'pointer',
          pointerType,
        });
      }
    },
    [direction, step, minSizes, maxSizes, snapPoints, snapTolerance, onResize]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      // Only handle events from the captured pointer
      if (
        !dragStateRef.current ||
        e.pointerId !== dragStateRef.current.pointerId
      ) {
        return;
      }

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

  const handlePointerUp = useCallback((e: PointerEvent) => {
    // Only handle events from the captured pointer
    if (
      !dragStateRef.current ||
      e.pointerId !== dragStateRef.current.pointerId
    ) {
      return;
    }

    // Release pointer capture
    const { element, pointerId, pointerType } = dragStateRef.current;
    if (element?.hasPointerCapture?.(pointerId)) {
      element.releasePointerCapture(pointerId);
    }

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
        source: 'pointer',
        pointerType,
      });
    }

    dragStateRef.current = null;
  }, []);

  const handlePointerDown = useCallback(
    (dividerIndex: number) => (e: React.PointerEvent) => {
      e.preventDefault();

      const startPosition = direction === 'horizontal' ? e.clientX : e.clientY;
      const element = e.currentTarget as HTMLElement;

      // Capture the pointer to receive all pointer events even if pointer leaves element
      element.setPointerCapture(e.pointerId);

      const pointerType = e.pointerType as 'mouse' | 'touch' | 'pen';

      dragStateRef.current = {
        dividerIndex,
        startPosition,
        startSizes: currentSizes,
        pointerId: e.pointerId,
        pointerType,
        element,
      };

      setIsDragging(true);

      if (onResizeStart) {
        onResizeStart({
          sizes: currentSizes,
          source: 'pointer',
          pointerType,
          originalEvent: e.nativeEvent,
        });
      }
    },
    [direction, currentSizes, onResizeStart]
  );

  // Set up global event listeners for pointer events
  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerUp);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return {
    isDragging,
    currentSizes,
    handlePointerDown,
  };
}
