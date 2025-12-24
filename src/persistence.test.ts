import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePersistence } from './persistence';

describe('usePersistence', () => {
  let mockStorage: Storage;

  beforeEach(() => {
    mockStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };
  });

  describe('initialization', () => {
    it('returns empty array when storage is empty', () => {
      (mockStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const { result } = renderHook(() =>
        usePersistence({ key: 'test-key', storage: mockStorage })
      );

      expect(result.current[0]).toEqual([]);
    });

    it('parses and returns stored sizes', () => {
      (mockStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
        '[300, 500]'
      );

      const { result } = renderHook(() =>
        usePersistence({ key: 'test-key', storage: mockStorage })
      );

      expect(result.current[0]).toEqual([300, 500]);
    });

    it('returns empty array on parse error', () => {
      (mockStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
        'invalid json'
      );

      const { result } = renderHook(() =>
        usePersistence({ key: 'test-key', storage: mockStorage })
      );

      expect(result.current[0]).toEqual([]);
    });

    it('handles storage access error gracefully', () => {
      (mockStorage.getItem as ReturnType<typeof vi.fn>).mockImplementation(
        () => {
          throw new Error('Storage access denied');
        }
      );

      const { result } = renderHook(() =>
        usePersistence({ key: 'test-key', storage: mockStorage })
      );

      expect(result.current[0]).toEqual([]);
    });
  });

  describe('setSizes', () => {
    it('updates sizes state', () => {
      (mockStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const { result } = renderHook(() =>
        usePersistence({ key: 'test-key', storage: mockStorage })
      );

      act(() => {
        result.current[1]([400, 600]);
      });

      expect(result.current[0]).toEqual([400, 600]);
    });

    it('persists sizes to storage after debounce', () => {
      (mockStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const { result } = renderHook(() =>
        usePersistence({ key: 'test-key', storage: mockStorage, debounce: 100 })
      );

      act(() => {
        result.current[1]([400, 600]);
      });

      // Before debounce
      expect(mockStorage.setItem).not.toHaveBeenCalled();

      // After debounce
      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(mockStorage.setItem).toHaveBeenCalledWith('test-key', '[400,600]');
    });

    it('uses default debounce of 300ms', () => {
      (mockStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const { result } = renderHook(() =>
        usePersistence({ key: 'test-key', storage: mockStorage })
      );

      act(() => {
        result.current[1]([400, 600]);
      });

      act(() => {
        vi.advanceTimersByTime(299);
      });
      expect(mockStorage.setItem).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(mockStorage.setItem).toHaveBeenCalled();
    });

    it('does not persist empty sizes array', () => {
      (mockStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);

      renderHook(() =>
        usePersistence({ key: 'test-key', storage: mockStorage })
      );

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(mockStorage.setItem).not.toHaveBeenCalled();
    });

    it('handles storage write error gracefully', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      (mockStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      (mockStorage.setItem as ReturnType<typeof vi.fn>).mockImplementation(
        () => {
          throw new Error('Storage quota exceeded');
        }
      );

      const { result } = renderHook(() =>
        usePersistence({ key: 'test-key', storage: mockStorage })
      );

      act(() => {
        result.current[1]([400, 600]);
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to persist pane sizes:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('debounce behavior', () => {
    it('cancels pending save on new update', () => {
      (mockStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const { result } = renderHook(() =>
        usePersistence({ key: 'test-key', storage: mockStorage, debounce: 100 })
      );

      act(() => {
        result.current[1]([400, 600]);
      });

      act(() => {
        vi.advanceTimersByTime(50);
      });

      act(() => {
        result.current[1]([500, 500]);
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(mockStorage.setItem).toHaveBeenCalledTimes(1);
      expect(mockStorage.setItem).toHaveBeenCalledWith('test-key', '[500,500]');
    });

    it('cleans up timeout on unmount', () => {
      (mockStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const { result, unmount } = renderHook(() =>
        usePersistence({ key: 'test-key', storage: mockStorage, debounce: 100 })
      );

      act(() => {
        result.current[1]([400, 600]);
      });

      unmount();

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(mockStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('key changes', () => {
    it('uses new key for storage operations', () => {
      (mockStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const { result, rerender } = renderHook(
        ({ key }) => usePersistence({ key, storage: mockStorage }),
        { initialProps: { key: 'key-1' } }
      );

      act(() => {
        result.current[1]([400, 600]);
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(mockStorage.setItem).toHaveBeenCalledWith('key-1', '[400,600]');

      rerender({ key: 'key-2' });

      act(() => {
        result.current[1]([200, 800]);
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(mockStorage.setItem).toHaveBeenCalledWith('key-2', '[200,800]');
    });
  });
});
