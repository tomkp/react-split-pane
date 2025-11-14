import { useCallback } from 'react';
import { Direction, ResizeEvent } from '../types';
import { calculateDraggedSizes, clamp } from '../utils/calculations';
import { announce, formatSizeForAnnouncement } from '../utils/accessibility';

export interface UseKeyboardResizeOptions {
  direction: Direction;
  sizes: number[];
  minSizes: number[];
  maxSizes: number[];
  step?: number | undefined;
  largeStep?: number | undefined;
  onResize?: ((sizes: number[], event: ResizeEvent) => void) | undefined;
  onResizeEnd?: ((sizes: number[], event: ResizeEvent) => void) | undefined;
}

const DEFAULT_STEP = 10;
const DEFAULT_LARGE_STEP = 50;

export function useKeyboardResize(options: UseKeyboardResizeOptions) {
  const {
    direction,
    sizes,
    minSizes,
    maxSizes,
    step = DEFAULT_STEP,
    largeStep = DEFAULT_LARGE_STEP,
    onResize,
    onResizeEnd,
  } = options;

  const handleKeyDown = useCallback(
    (dividerIndex: number) => (e: React.KeyboardEvent) => {
      const isHorizontal = direction === 'horizontal';
      const moveKeys = isHorizontal
        ? ['ArrowLeft', 'ArrowRight']
        : ['ArrowUp', 'ArrowDown'];

      if (
        !moveKeys.includes(e.key) &&
        e.key !== 'Home' &&
        e.key !== 'End' &&
        e.key !== 'Escape'
      ) {
        return;
      }

      e.preventDefault();

      let delta = 0;
      let newSizes = [...sizes];

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          delta = -(e.shiftKey ? largeStep : step);
          break;

        case 'ArrowRight':
        case 'ArrowDown':
          delta = e.shiftKey ? largeStep : step;
          break;

        case 'Home':
          // Minimize left/top pane
          newSizes[dividerIndex] = minSizes[dividerIndex] ?? 0;
          newSizes[dividerIndex + 1] =
            (sizes[dividerIndex] ?? 0) + (sizes[dividerIndex + 1] ?? 0) - newSizes[dividerIndex];
          break;

        case 'End':
          // Maximize left/top pane
          const maxLeft = maxSizes[dividerIndex] ?? Infinity;
          const minRight = minSizes[dividerIndex + 1] ?? 0;
          const totalSize = (sizes[dividerIndex] ?? 0) + (sizes[dividerIndex + 1] ?? 0);

          newSizes[dividerIndex] = Math.min(maxLeft, totalSize - minRight);
          newSizes[dividerIndex + 1] = totalSize - newSizes[dividerIndex];
          break;

        case 'Escape':
          // Could restore original size if we track it
          return;
      }

      if (delta !== 0) {
        newSizes = calculateDraggedSizes(
          sizes,
          dividerIndex,
          delta,
          minSizes,
          maxSizes
        );
      }

      // Ensure constraints are met
      newSizes = newSizes.map((size, idx) =>
        clamp(size, minSizes[idx] ?? 0, maxSizes[idx] ?? Infinity)
      );

      if (onResize) {
        onResize(newSizes, {
          sizes: newSizes,
          source: 'keyboard',
          originalEvent: e.nativeEvent,
        });
      }

      if (onResizeEnd) {
        onResizeEnd(newSizes, {
          sizes: newSizes,
          source: 'keyboard',
          originalEvent: e.nativeEvent,
        });
      }

      // Announce change to screen readers
      const changedPaneIndex = delta > 0 ? dividerIndex : dividerIndex + 1;
      announce(
        `Pane ${changedPaneIndex + 1} resized to ${formatSizeForAnnouncement(
          newSizes[changedPaneIndex] ?? 0
        )}`
      );
    },
    [
      direction,
      sizes,
      minSizes,
      maxSizes,
      step,
      largeStep,
      onResize,
      onResizeEnd,
    ]
  );

  return { handleKeyDown };
}
