import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` that degrades to `useEffect` during server rendering.
 */
export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;
