import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardResize } from './useKeyboardResize';

// Mock the accessibility module
vi.mock('../utils/accessibility', () => ({
  announce: vi.fn(),
  formatSizeForAnnouncement: (size: number) => `${size} pixels`,
}));

describe('useKeyboardResize', () => {
  const createKeyboardEvent = (
    key: string,
    options: Partial<React.KeyboardEvent> = {}
  ): React.KeyboardEvent => ({
    key,
    shiftKey: false,
    preventDefault: vi.fn(),
    nativeEvent: new KeyboardEvent('keydown', { key }),
    ...options,
  } as unknown as React.KeyboardEvent);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('arrow key navigation - horizontal', () => {
    it('increases pane size with ArrowRight', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          onResize,
        })
      );

      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('ArrowRight'));
      });

      expect(onResize).toHaveBeenCalledWith(
        [310, 690], // Default step is 10
        expect.objectContaining({ source: 'keyboard' })
      );
    });

    it('decreases pane size with ArrowLeft', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          onResize,
        })
      );

      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('ArrowLeft'));
      });

      expect(onResize).toHaveBeenCalledWith(
        [290, 710], // Decreased by step
        expect.objectContaining({ source: 'keyboard' })
      );
    });

    it('uses large step with shift+arrow', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          onResize,
        })
      );

      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('ArrowRight', { shiftKey: true }));
      });

      expect(onResize).toHaveBeenCalledWith(
        [350, 650], // Large step default is 50
        expect.objectContaining({ source: 'keyboard' })
      );
    });

    it('ignores ArrowUp/ArrowDown in horizontal mode', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          onResize,
        })
      );

      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('ArrowUp'));
      });

      expect(onResize).not.toHaveBeenCalled();
    });
  });

  describe('arrow key navigation - vertical', () => {
    it('increases pane size with ArrowDown', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'vertical',
          sizes: [300, 500],
          minSizes: [100, 100],
          maxSizes: [400, 600],
          onResize,
        })
      );

      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('ArrowDown'));
      });

      expect(onResize).toHaveBeenCalledWith(
        [310, 490],
        expect.objectContaining({ source: 'keyboard' })
      );
    });

    it('decreases pane size with ArrowUp', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'vertical',
          sizes: [300, 500],
          minSizes: [100, 100],
          maxSizes: [400, 600],
          onResize,
        })
      );

      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('ArrowUp'));
      });

      expect(onResize).toHaveBeenCalledWith(
        [290, 510],
        expect.objectContaining({ source: 'keyboard' })
      );
    });

    it('ignores ArrowLeft/ArrowRight in vertical mode', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'vertical',
          sizes: [300, 500],
          minSizes: [100, 100],
          maxSizes: [400, 600],
          onResize,
        })
      );

      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('ArrowLeft'));
      });

      expect(onResize).not.toHaveBeenCalled();
    });
  });

  describe('Home key', () => {
    it('minimizes left/top pane to min size', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          onResize,
        })
      );

      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('Home'));
      });

      expect(onResize).toHaveBeenCalledWith(
        [100, 900], // First pane at min, second gets the difference
        expect.objectContaining({ source: 'keyboard' })
      );
    });

    it('handles missing min size (defaults to 0)', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [],
          maxSizes: [],
          onResize,
        })
      );

      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('Home'));
      });

      expect(onResize).toHaveBeenCalledWith(
        [0, 1000],
        expect.objectContaining({ source: 'keyboard' })
      );
    });
  });

  describe('End key', () => {
    it('maximizes left/top pane to max size', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          onResize,
        })
      );

      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('End'));
      });

      expect(onResize).toHaveBeenCalledWith(
        [500, 500], // First pane at max, respecting second pane's min
        expect.objectContaining({ source: 'keyboard' })
      );
    });

    it('respects adjacent pane min size', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 300],
          maxSizes: [800, 900], // Max would allow 800, but second pane needs 300
          onResize,
        })
      );

      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('End'));
      });

      expect(onResize).toHaveBeenCalledWith(
        [700, 300], // Can only go to 700 because second pane needs 300
        expect.objectContaining({ source: 'keyboard' })
      );
    });
  });

  describe('Escape key', () => {
    it('prevents default but does not resize', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          onResize,
        })
      );

      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('Escape'));
      });

      expect(onResize).not.toHaveBeenCalled();
    });
  });

  describe('custom step sizes', () => {
    it('uses custom step value', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          step: 25,
          onResize,
        })
      );

      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('ArrowRight'));
      });

      expect(onResize).toHaveBeenCalledWith(
        [325, 675],
        expect.objectContaining({ source: 'keyboard' })
      );
    });

    it('uses custom largeStep value', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          largeStep: 100,
          onResize,
        })
      );

      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('ArrowRight', { shiftKey: true }));
      });

      expect(onResize).toHaveBeenCalledWith(
        [400, 600],
        expect.objectContaining({ source: 'keyboard' })
      );
    });
  });

  describe('boundary conditions', () => {
    it('respects minimum constraints', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [110, 890],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          step: 20,
          onResize,
        })
      );

      // Try to decrease below minimum
      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('ArrowLeft'));
      });

      // Should be clamped to minimum
      const calledSizes = onResize.mock.calls[0][0];
      expect(calledSizes[0]).toBeGreaterThanOrEqual(100);
    });

    it('respects maximum constraints', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [490, 510],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          step: 20,
          onResize,
        })
      );

      // Try to increase above maximum
      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('ArrowRight'));
      });

      // Should be clamped to maximum
      const calledSizes = onResize.mock.calls[0][0];
      expect(calledSizes[0]).toBeLessThanOrEqual(500);
    });
  });

  describe('callbacks', () => {
    it('calls onResize with event info', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          onResize,
        })
      );

      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('ArrowRight'));
      });

      expect(onResize).toHaveBeenCalledWith(expect.any(Array), {
        sizes: expect.any(Array),
        source: 'keyboard',
        originalEvent: expect.any(KeyboardEvent),
      });
    });

    it('calls onResizeEnd after resize', () => {
      const onResizeEnd = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          onResizeEnd,
        })
      );

      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(createKeyboardEvent('ArrowRight'));
      });

      expect(onResizeEnd).toHaveBeenCalledWith(
        [310, 690],
        expect.objectContaining({ source: 'keyboard' })
      );
    });
  });

  describe('multiple panes', () => {
    it('handles middle divider in 3-pane layout', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [300, 400, 300],
          minSizes: [100, 100, 100],
          maxSizes: [500, 600, 500],
          onResize,
        })
      );

      // Press right on middle divider
      act(() => {
        const handleKeyDown = result.current.handleKeyDown(1);
        handleKeyDown(createKeyboardEvent('ArrowRight'));
      });

      const calledSizes = onResize.mock.calls[0][0];
      expect(calledSizes[0]).toBe(300); // Unchanged
      expect(calledSizes[1]).toBe(410); // Increased
      expect(calledSizes[2]).toBe(290); // Decreased
    });

    it('Home key minimizes correct pane with middle divider', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [300, 400, 300],
          minSizes: [100, 100, 100],
          maxSizes: [500, 600, 500],
          onResize,
        })
      );

      // Press Home on middle divider
      act(() => {
        const handleKeyDown = result.current.handleKeyDown(1);
        handleKeyDown(createKeyboardEvent('Home'));
      });

      const calledSizes = onResize.mock.calls[0][0];
      expect(calledSizes[0]).toBe(300); // First pane unchanged
      expect(calledSizes[1]).toBe(100); // Second pane minimized
      expect(calledSizes[2]).toBe(500); // Third pane gets the space (clamped to max)
    });
  });

  describe('unhandled keys', () => {
    it('ignores unrelated keys', () => {
      const onResize = vi.fn();
      const event = createKeyboardEvent('Tab');
      const { result } = renderHook(() =>
        useKeyboardResize({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          onResize,
        })
      );

      act(() => {
        const handleKeyDown = result.current.handleKeyDown(0);
        handleKeyDown(event);
      });

      expect(onResize).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });
});
