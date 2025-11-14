import { useEffect, useState } from 'react';
import { Size } from '../types';
import { convertToPixels } from '../utils/calculations';

export interface UsePaneSizeOptions {
  defaultSize?: Size;
  size?: Size;
  minSize?: Size;
  maxSize?: Size;
  containerSize: number;
}

export interface UsePaneSizeResult {
  pixelSize: number;
  minPixelSize: number;
  maxPixelSize: number;
  isControlled: boolean;
}

export function usePaneSize(options: UsePaneSizeOptions): UsePaneSizeResult {
  const { defaultSize, size, minSize = 0, maxSize = Infinity, containerSize } = options;

  const isControlled = size !== undefined;

  // Convert sizes to pixels
  const defaultPixelSize = defaultSize
    ? convertToPixels(defaultSize, containerSize)
    : containerSize / 2; // Default to 50%

  const minPixelSize = convertToPixels(minSize, containerSize);
  const maxPixelSize =
    maxSize === Infinity ? Infinity : convertToPixels(maxSize, containerSize);

  const [internalSize, setInternalSize] = useState(defaultPixelSize);

  const pixelSize = isControlled
    ? convertToPixels(size, containerSize)
    : internalSize;

  // Update internal size when defaultSize or containerSize changes (uncontrolled only)
  useEffect(() => {
    if (!isControlled) {
      const newDefaultSize = defaultSize
        ? convertToPixels(defaultSize, containerSize)
        : containerSize / 2;
      setInternalSize(newDefaultSize);
    }
  }, [defaultSize, containerSize, isControlled]);

  return {
    pixelSize,
    minPixelSize,
    maxPixelSize,
    isControlled,
  };
}
