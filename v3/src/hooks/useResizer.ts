import { useCallback, useEffect, useRef, useState } from 'react';
import { Direction, ResizeEvent } from '../types';
import { calculateDraggedSizes, snapToPoint, applyStep } from '../utils/calculations';

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

export interface UseResizerResult {
  isDragging: boolean;
  currentSizes: number[];
  handleMouseDown: (dividerIndex: number) => (e: React.MouseEvent) => void;
  handleTouchStart: (dividerIndex: number) => (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
}

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

  // Update current sizes when prop sizes change
  useEffect(() => {
    if (!isDragging) {
      setCurrentSizes(sizes);
    }
  }, [sizes, isDragging]);

  const handleDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!dragStateRef.current) return;

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

      // Use RAF to throttle updates
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        handleDrag(e.clientX, e.clientY);
        rafRef.current = null;
      });
    },
    [handleDrag]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();

      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        const touch = e.touches[0];
        if (touch) {
          handleDrag(touch.clientX, touch.clientY);
        }
        rafRef.current = null;
      });
    },
    [handleDrag]
  );

  const handleMouseUp = useCallback(() => {
    if (!dragStateRef.current) return;

    setIsDragging(false);

    if (onResizeEnd) {
      onResizeEnd(currentSizes, {
        sizes: currentSizes,
        source: 'mouse',
      });
    }

    dragStateRef.current = null;

    // Cancel any pending RAF
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, [currentSizes, onResizeEnd]);

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

      const startPosition = direction === 'horizontal' ? touch.clientX : touch.clientY;

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
