import { useCallback, useEffect, useRef, useState } from 'react';
import type { Direction, ResizeEvent } from '../types';
import {
  calculateDraggedSizes,
  snapToPoint,
  applyStep,
} from '../utils/calculations';
import { useIsomorphicLayoutEffect } from '../utils/useIsomorphicLayoutEffect';

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

interface DragState {
  dividerIndex: number;
  startPosition: number;
  startSizes: number[];
  /** null until known, for drags started by the legacy mouse/touch handlers */
  pointerId: number | null;
  pointerType: 'mouse' | 'touch' | 'pen';
  element: HTMLElement | null;
}

/**
 * Check whether a document pointer event belongs to the drag in progress.
 * A drag started by the legacy mouse/touch handlers has no pointerId, so it
 * adopts the first primary pointer that follows, whatever its type (browsers
 * also fire compatibility mouse events for pen input).
 */
function isDragPointer(
  dragState: DragState | null,
  e: PointerEvent
): dragState is DragState {
  if (!dragState) return false;
  if (dragState.pointerId === null && e.isPrimary) {
    dragState.pointerId = e.pointerId;
  }
  return e.pointerId === dragState.pointerId;
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

  const dragStateRef = useRef<DragState | null>(null);

  const rafRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);

  // Use refs to avoid stale closures in event handlers
  const currentSizesRef = useRef(currentSizes);
  currentSizesRef.current = currentSizes;

  const onResizeEndRef = useRef(onResizeEnd);
  onResizeEndRef.current = onResizeEnd;

  // Sync sizes from props when not dragging (React 19 compatible)
  // Layout effect so an external size change (e.g. a controlled pane collapsing)
  // updates the rendered width in lockstep with consumer content.
  const sizesRef = useRef(sizes);
  useIsomorphicLayoutEffect(() => {
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

      const newSizes = calculateDraggedSizes(
        startSizes,
        dividerIndex,
        delta,
        minSizes,
        maxSizes
      );

      // Apply snap points to the dragged divider. The trailing pane absorbs
      // the opposite delta so the total width is preserved.
      if (snapPoints.length > 0) {
        const target = newSizes[dividerIndex] ?? 0;
        const snapped = snapToPoint(target, snapPoints, snapTolerance);
        if (snapped !== target) {
          const delta = snapped - target;
          newSizes[dividerIndex] = snapped;
          newSizes[dividerIndex + 1] =
            (newSizes[dividerIndex + 1] ?? 0) - delta;
        }
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
      if (!isDragPointer(dragStateRef.current, e)) {
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
    if (!isDragPointer(dragStateRef.current, e)) {
      return;
    }

    // Release pointer capture
    const { element, pointerType } = dragStateRef.current;
    if (element?.hasPointerCapture?.(e.pointerId)) {
      element.releasePointerCapture(e.pointerId);
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
      // A divider wired to both onPointerDown and a legacy handler gets two
      // starts per gesture (e.g. pointerdown then touchstart), so keep the first
      if (dragStateRef.current) return;

      e.preventDefault();

      const startPosition = direction === 'horizontal' ? e.clientX : e.clientY;
      const element = e.currentTarget as HTMLElement;
      // Events from the legacy mouse/touch handlers have no pointerId
      const pointerId = e.pointerId ?? null;

      // Capture the pointer to receive all pointer events even if pointer leaves element
      if (pointerId !== null) {
        element.setPointerCapture(pointerId);
      }

      const pointerType = e.pointerType as 'mouse' | 'touch' | 'pen';

      dragStateRef.current = {
        dividerIndex,
        startPosition,
        startSizes: currentSizes,
        pointerId,
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
