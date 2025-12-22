import type { Size } from '../types';

/**
 * Convert a size value (string or number) to pixels
 * @param size - Size value (e.g., "50%", "200px", 300)
 * @param containerSize - Container size in pixels
 * @returns Size in pixels
 */
export function convertToPixels(size: Size, containerSize: number): number {
  if (typeof size === 'number') {
    return size;
  }

  if (size.endsWith('%')) {
    const percentage = parseFloat(size);
    return (percentage / 100) * containerSize;
  }

  if (size.endsWith('px')) {
    return parseFloat(size);
  }

  // Try to parse as number
  const parsed = parseFloat(size);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Constrain a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Snap a value to the nearest snap point if within tolerance
 */
export function snapToPoint(
  value: number,
  snapPoints: number[],
  tolerance: number
): number {
  for (const point of snapPoints) {
    if (Math.abs(value - point) <= tolerance) {
      return point;
    }
  }
  return value;
}

/**
 * Distribute sizes proportionally when container size changes
 */
export function distributeSizes(
  currentSizes: number[],
  newContainerSize: number
): number[] {
  const totalCurrentSize = currentSizes.reduce((sum, size) => sum + size, 0);

  if (totalCurrentSize === 0) {
    // Equal distribution
    const equalSize = newContainerSize / currentSizes.length;
    return currentSizes.map(() => equalSize);
  }

  // Proportional distribution
  return currentSizes.map(
    (size) => (size / totalCurrentSize) * newContainerSize
  );
}

/**
 * Calculate new sizes after a divider drag
 */
export function calculateDraggedSizes(
  sizes: number[],
  dividerIndex: number,
  delta: number,
  minSizes: number[],
  maxSizes: number[]
): number[] {
  const newSizes = [...sizes];

  const leftSize = sizes[dividerIndex] ?? 0;
  const rightSize = sizes[dividerIndex + 1] ?? 0;
  const leftMin = minSizes[dividerIndex] ?? 0;
  const leftMax = maxSizes[dividerIndex] ?? Infinity;
  const rightMin = minSizes[dividerIndex + 1] ?? 0;
  const rightMax = maxSizes[dividerIndex + 1] ?? Infinity;

  // Calculate new sizes for the two panes around the divider
  let newLeftSize = clamp(leftSize + delta, leftMin, leftMax);
  let newRightSize = clamp(rightSize - delta, rightMin, rightMax);

  // Check if we hit constraints
  const leftDelta = newLeftSize - leftSize;
  const rightDelta = rightSize - newRightSize;

  // Use the smaller delta to ensure both panes respect constraints
  const actualDelta = Math.min(Math.abs(leftDelta), Math.abs(rightDelta));

  if (delta > 0) {
    newLeftSize = leftSize + actualDelta;
    newRightSize = rightSize - actualDelta;
  } else {
    newLeftSize = leftSize - actualDelta;
    newRightSize = rightSize + actualDelta;
  }

  newSizes[dividerIndex] = newLeftSize;
  newSizes[dividerIndex + 1] = newRightSize;

  return newSizes;
}

/**
 * Apply step-based resizing
 */
export function applyStep(delta: number, step: number): number {
  if (step <= 0) return delta;

  const steps = Math.round(delta / step);
  return steps * step;
}
