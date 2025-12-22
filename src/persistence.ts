import { useEffect, useState } from 'react';

export interface UsePersistenceOptions {
  key: string;
  storage?: Storage;
  debounce?: number;
}

/**
 * Hook for persisting pane sizes to localStorage/sessionStorage
 *
 * @example
 * ```tsx
 * function App() {
 *   const [sizes, setSizes] = usePersistence({ key: 'my-layout' });
 *
 *   return (
 *     <SplitPane onResize={setSizes}>
 *       <Pane size={sizes[0]}>...</Pane>
 *       <Pane size={sizes[1]}>...</Pane>
 *     </SplitPane>
 *   );
 * }
 * ```
 */
export function usePersistence(
  options: UsePersistenceOptions
): [number[], (sizes: number[]) => void] {
  const { key, storage = localStorage, debounce = 300 } = options;

  const [sizes, setSizes] = useState<number[]>(() => {
    try {
      const stored = storage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Debounced save to storage
  useEffect(() => {
    if (sizes.length === 0) return;

    const timeout = setTimeout(() => {
      try {
        storage.setItem(key, JSON.stringify(sizes));
      } catch (error) {
        console.warn('Failed to persist pane sizes:', error);
      }
    }, debounce);

    return () => clearTimeout(timeout);
  }, [sizes, key, storage, debounce]);

  return [sizes, setSizes];
}
