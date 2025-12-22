import { useCallback, useRef } from 'react';
import type { Direction, ResizeEvent } from '../types';
import { calculateDraggedSizes, clamp } from '../utils/calculations';
import { announce, formatSizeForAnnouncement } from '../utils/accessibility';

/**
 * Options for the useKeyboardResize hook.
 */
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

/**
 * Hook that handles keyboard-based resizing of panes.
 *
 * This is a low-level hook used internally by SplitPane. For most use cases,
 * you should use the SplitPane component directly.
 *
 * Supported keys:
 * - Arrow keys: Resize by step (default 10px)
 * - Shift + Arrow: Resize by large step (default 50px)
 * - Home: Minimize the left/top pane to its minimum size
 * - End: Maximize the left/top pane to its maximum size
 * - Escape: Restore pane sizes to what they were when keyboard interaction started
 *
 * @param options - Configuration options for keyboard resize
 * @returns Handler for keyboard events
 */
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

  // Track sizes at start of keyboard interaction for Escape to restore
  const initialSizesRef = useRef<number[] | null>(null);

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

      // Handle Escape - restore to initial sizes
      if (e.key === 'Escape') {
        if (initialSizesRef.current) {
          const restoredSizes = initialSizesRef.current;
          initialSizesRef.current = null;

          if (onResize) {
            onResize(restoredSizes, {
              sizes: restoredSizes,
              source: 'keyboard',
              originalEvent: e.nativeEvent,
            });
          }

          if (onResizeEnd) {
            onResizeEnd(restoredSizes, {
              sizes: restoredSizes,
              source: 'keyboard',
              originalEvent: e.nativeEvent,
            });
          }

          announce('Pane sizes restored');
        }
        return;
      }

      // Store initial sizes on first keyboard interaction
      if (initialSizesRef.current === null) {
        initialSizesRef.current = [...sizes];
      }

      let delta = 0;
      let newSizes = [...sizes];
      let announcementKey: 'home' | 'end' | 'arrow' = 'arrow';

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          delta = -(e.shiftKey ? largeStep : step);
          break;

        case 'ArrowRight':
        case 'ArrowDown':
          delta = e.shiftKey ? largeStep : step;
          break;

        case 'Home': {
          // Minimize left/top pane
          announcementKey = 'home';
          const leftPaneIndex = dividerIndex;
          const rightPaneIndex = dividerIndex + 1;
          const minLeft = minSizes[leftPaneIndex] ?? 0;
          const totalSize =
            (sizes[leftPaneIndex] ?? 0) + (sizes[rightPaneIndex] ?? 0);

          newSizes[leftPaneIndex] = minLeft;
          newSizes[rightPaneIndex] = totalSize - minLeft;
          break;
        }

        case 'End': {
          // Maximize left/top pane
          announcementKey = 'end';
          const leftPaneIndex = dividerIndex;
          const rightPaneIndex = dividerIndex + 1;
          const maxLeft = maxSizes[leftPaneIndex] ?? Infinity;
          const minRight = minSizes[rightPaneIndex] ?? 0;
          const totalSize =
            (sizes[leftPaneIndex] ?? 0) + (sizes[rightPaneIndex] ?? 0);

          newSizes[leftPaneIndex] = Math.min(maxLeft, totalSize - minRight);
          newSizes[rightPaneIndex] = totalSize - newSizes[leftPaneIndex];
          break;
        }
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
      if (announcementKey === 'home') {
        announce(
          `Pane ${dividerIndex + 1} minimized to ${formatSizeForAnnouncement(
            newSizes[dividerIndex] ?? 0
          )}`
        );
      } else if (announcementKey === 'end') {
        announce(
          `Pane ${dividerIndex + 1} maximized to ${formatSizeForAnnouncement(
            newSizes[dividerIndex] ?? 0
          )}`
        );
      } else {
        // Arrow key - announce the pane that changed
        const changedPaneIndex = delta > 0 ? dividerIndex : dividerIndex + 1;
        announce(
          `Pane ${changedPaneIndex + 1} resized to ${formatSizeForAnnouncement(
            newSizes[changedPaneIndex] ?? 0
          )}`
        );
      }
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
