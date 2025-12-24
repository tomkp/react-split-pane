import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useResizer } from './useResizer';

describe('useResizer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('initializes with provided sizes', () => {
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
        })
      );

      expect(result.current.currentSizes).toEqual([300, 700]);
      expect(result.current.isDragging).toBe(false);
    });

    it('updates currentSizes when sizes prop changes', () => {
      const { result, rerender } = renderHook(
        ({ sizes }) =>
          useResizer({
            direction: 'horizontal',
            sizes,
            minSizes: [100, 100],
            maxSizes: [500, 900],
          }),
        { initialProps: { sizes: [300, 700] } }
      );

      expect(result.current.currentSizes).toEqual([300, 700]);

      rerender({ sizes: [400, 600] });

      expect(result.current.currentSizes).toEqual([400, 600]);
    });

    it('does not update sizes while dragging', () => {
      const { result, rerender } = renderHook(
        ({ sizes }) =>
          useResizer({
            direction: 'horizontal',
            sizes,
            minSizes: [100, 100],
            maxSizes: [500, 900],
          }),
        { initialProps: { sizes: [300, 700] } }
      );

      // Start a drag
      act(() => {
        const mouseDown = result.current.handleMouseDown(0);
        mouseDown({
          preventDefault: vi.fn(),
          clientX: 300,
          clientY: 0,
          nativeEvent: new MouseEvent('mousedown'),
        } as unknown as React.MouseEvent);
      });

      expect(result.current.isDragging).toBe(true);

      // Try to update sizes from prop
      rerender({ sizes: [400, 600] });

      // Should still be the original sizes since we're dragging
      expect(result.current.currentSizes).toEqual([300, 700]);
    });
  });

  describe('mouse drag interactions', () => {
    it('starts dragging on mouseDown', () => {
      const onResizeStart = vi.fn();
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          onResizeStart,
        })
      );

      act(() => {
        const mouseDown = result.current.handleMouseDown(0);
        mouseDown({
          preventDefault: vi.fn(),
          clientX: 300,
          clientY: 0,
          nativeEvent: new MouseEvent('mousedown'),
        } as unknown as React.MouseEvent);
      });

      expect(result.current.isDragging).toBe(true);
      expect(onResizeStart).toHaveBeenCalledWith({
        sizes: [300, 700],
        source: 'mouse',
        originalEvent: expect.any(MouseEvent),
      });
    });

    it('updates sizes during horizontal drag', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          onResize,
        })
      );

      // Start drag
      act(() => {
        const mouseDown = result.current.handleMouseDown(0);
        mouseDown({
          preventDefault: vi.fn(),
          clientX: 300,
          clientY: 0,
          nativeEvent: new MouseEvent('mousedown'),
        } as unknown as React.MouseEvent);
      });

      // Simulate mouse move (document level event)
      act(() => {
        const mouseMoveEvent = new MouseEvent('mousemove', {
          clientX: 350,
          clientY: 0,
        });
        document.dispatchEvent(mouseMoveEvent);
        vi.runAllTimers(); // RAF is mocked with timers
      });

      expect(onResize).toHaveBeenCalled();
      expect(result.current.currentSizes[0]).toBe(350);
      expect(result.current.currentSizes[1]).toBe(650);
    });

    it('updates sizes during vertical drag', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useResizer({
          direction: 'vertical',
          sizes: [300, 500],
          minSizes: [100, 100],
          maxSizes: [400, 600],
          onResize,
        })
      );

      // Start drag
      act(() => {
        const mouseDown = result.current.handleMouseDown(0);
        mouseDown({
          preventDefault: vi.fn(),
          clientX: 0,
          clientY: 300,
          nativeEvent: new MouseEvent('mousedown'),
        } as unknown as React.MouseEvent);
      });

      // Simulate vertical mouse move
      act(() => {
        const mouseMoveEvent = new MouseEvent('mousemove', {
          clientX: 0,
          clientY: 350,
        });
        document.dispatchEvent(mouseMoveEvent);
        vi.runAllTimers();
      });

      expect(result.current.currentSizes[0]).toBe(350);
      expect(result.current.currentSizes[1]).toBe(450);
    });

    it('ends drag on mouseUp', () => {
      const onResizeEnd = vi.fn();
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          onResizeEnd,
        })
      );

      // Start drag
      act(() => {
        const mouseDown = result.current.handleMouseDown(0);
        mouseDown({
          preventDefault: vi.fn(),
          clientX: 300,
          clientY: 0,
          nativeEvent: new MouseEvent('mousedown'),
        } as unknown as React.MouseEvent);
      });

      expect(result.current.isDragging).toBe(true);

      // End drag
      act(() => {
        document.dispatchEvent(new MouseEvent('mouseup'));
      });

      expect(result.current.isDragging).toBe(false);
      expect(onResizeEnd).toHaveBeenCalledWith([300, 700], {
        sizes: [300, 700],
        source: 'mouse',
      });
    });

    it('respects minimum size constraints', () => {
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [200, 100],
          maxSizes: [500, 900],
        })
      );

      // Start drag
      act(() => {
        const mouseDown = result.current.handleMouseDown(0);
        mouseDown({
          preventDefault: vi.fn(),
          clientX: 300,
          clientY: 0,
          nativeEvent: new MouseEvent('mousedown'),
        } as unknown as React.MouseEvent);
      });

      // Try to drag past minimum
      act(() => {
        const mouseMoveEvent = new MouseEvent('mousemove', {
          clientX: 50, // Would make first pane 50px
          clientY: 0,
        });
        document.dispatchEvent(mouseMoveEvent);
        vi.runAllTimers();
      });

      expect(result.current.currentSizes[0]).toBe(200); // Clamped to min
      expect(result.current.currentSizes[1]).toBe(800);
    });

    it('respects maximum size constraints', () => {
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [400, 900],
        })
      );

      // Start drag
      act(() => {
        const mouseDown = result.current.handleMouseDown(0);
        mouseDown({
          preventDefault: vi.fn(),
          clientX: 300,
          clientY: 0,
          nativeEvent: new MouseEvent('mousedown'),
        } as unknown as React.MouseEvent);
      });

      // Try to drag past maximum
      act(() => {
        const mouseMoveEvent = new MouseEvent('mousemove', {
          clientX: 600, // Would make first pane 600px
          clientY: 0,
        });
        document.dispatchEvent(mouseMoveEvent);
        vi.runAllTimers();
      });

      expect(result.current.currentSizes[0]).toBe(400); // Clamped to max
      expect(result.current.currentSizes[1]).toBe(600);
    });
  });

  describe('snap points', () => {
    it('snaps to nearby snap points', () => {
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [600, 900],
          snapPoints: [200, 400],
          snapTolerance: 15,
        })
      );

      // Start drag
      act(() => {
        const mouseDown = result.current.handleMouseDown(0);
        mouseDown({
          preventDefault: vi.fn(),
          clientX: 300,
          clientY: 0,
          nativeEvent: new MouseEvent('mousedown'),
        } as unknown as React.MouseEvent);
      });

      // Drag to position near snap point (395 should snap to 400)
      act(() => {
        const mouseMoveEvent = new MouseEvent('mousemove', {
          clientX: 395,
          clientY: 0,
        });
        document.dispatchEvent(mouseMoveEvent);
        vi.runAllTimers();
      });

      expect(result.current.currentSizes[0]).toBe(400); // Snapped
    });

    it('does not snap when outside tolerance', () => {
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [600, 900],
          snapPoints: [200, 400],
          snapTolerance: 10,
        })
      );

      // Start drag
      act(() => {
        const mouseDown = result.current.handleMouseDown(0);
        mouseDown({
          preventDefault: vi.fn(),
          clientX: 300,
          clientY: 0,
          nativeEvent: new MouseEvent('mousedown'),
        } as unknown as React.MouseEvent);
      });

      // Drag to position outside snap tolerance (350 is 50 away from 400)
      act(() => {
        const mouseMoveEvent = new MouseEvent('mousemove', {
          clientX: 350,
          clientY: 0,
        });
        document.dispatchEvent(mouseMoveEvent);
        vi.runAllTimers();
      });

      expect(result.current.currentSizes[0]).toBe(350); // No snap
    });
  });

  describe('step-based resizing', () => {
    it('applies step to drag movements', () => {
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [600, 900],
          step: 50,
        })
      );

      // Start drag
      act(() => {
        const mouseDown = result.current.handleMouseDown(0);
        mouseDown({
          preventDefault: vi.fn(),
          clientX: 300,
          clientY: 0,
          nativeEvent: new MouseEvent('mousedown'),
        } as unknown as React.MouseEvent);
      });

      // Drag 73 pixels (should be rounded to 50)
      act(() => {
        const mouseMoveEvent = new MouseEvent('mousemove', {
          clientX: 373,
          clientY: 0,
        });
        document.dispatchEvent(mouseMoveEvent);
        vi.runAllTimers();
      });

      expect(result.current.currentSizes[0]).toBe(350); // 300 + 50
    });
  });

  describe('multiple panes', () => {
    it('handles drag on middle divider (3 panes)', () => {
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 400, 300],
          minSizes: [100, 100, 100],
          maxSizes: [500, 600, 500],
        })
      );

      // Drag middle divider (index 1)
      act(() => {
        const mouseDown = result.current.handleMouseDown(1);
        mouseDown({
          preventDefault: vi.fn(),
          clientX: 700, // Start at divider 1 position (300 + 400)
          clientY: 0,
          nativeEvent: new MouseEvent('mousedown'),
        } as unknown as React.MouseEvent);
      });

      // Drag right by 50px
      act(() => {
        const mouseMoveEvent = new MouseEvent('mousemove', {
          clientX: 750,
          clientY: 0,
        });
        document.dispatchEvent(mouseMoveEvent);
        vi.runAllTimers();
      });

      expect(result.current.currentSizes[1]).toBe(450); // Increased
      expect(result.current.currentSizes[2]).toBe(250); // Decreased
      expect(result.current.currentSizes[0]).toBe(300); // Unchanged
    });
  });

  describe('touch interactions', () => {
    it('starts dragging on touchStart', () => {
      const onResizeStart = vi.fn();
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          onResizeStart,
        })
      );

      act(() => {
        const touchStart = result.current.handleTouchStart(0);
        touchStart({
          touches: [{ clientX: 300, clientY: 0 }],
          nativeEvent: new TouchEvent('touchstart'),
        } as unknown as React.TouchEvent);
      });

      expect(result.current.isDragging).toBe(true);
      expect(onResizeStart).toHaveBeenCalledWith({
        sizes: [300, 700],
        source: 'touch',
        originalEvent: expect.any(TouchEvent),
      });
    });

    it('updates sizes during touch move', () => {
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
        })
      );

      // Start touch
      act(() => {
        const touchStart = result.current.handleTouchStart(0);
        touchStart({
          touches: [{ clientX: 300, clientY: 0 }],
          nativeEvent: new TouchEvent('touchstart'),
        } as unknown as React.TouchEvent);
      });

      // Simulate touch move
      act(() => {
        const touchMoveEvent = new TouchEvent('touchmove', {
          touches: [{ clientX: 350, clientY: 0 } as Touch],
        });
        document.dispatchEvent(touchMoveEvent);
        vi.runAllTimers();
      });

      expect(result.current.currentSizes[0]).toBe(350);
      expect(result.current.currentSizes[1]).toBe(650);
    });

    it('ends drag on touchEnd', () => {
      const onResizeEnd = vi.fn();
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          onResizeEnd,
        })
      );

      // Start touch
      act(() => {
        const touchStart = result.current.handleTouchStart(0);
        touchStart({
          touches: [{ clientX: 300, clientY: 0 }],
          nativeEvent: new TouchEvent('touchstart'),
        } as unknown as React.TouchEvent);
      });

      expect(result.current.isDragging).toBe(true);

      // End touch via handleTouchEnd
      act(() => {
        result.current.handleTouchEnd({
          preventDefault: vi.fn(),
        } as unknown as React.TouchEvent);
      });

      expect(result.current.isDragging).toBe(false);
      expect(onResizeEnd).toHaveBeenCalled();
    });

    it('handles touch with no touches gracefully', () => {
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
        })
      );

      // Touch start with no touches
      act(() => {
        const touchStart = result.current.handleTouchStart(0);
        touchStart({
          touches: [],
          nativeEvent: new TouchEvent('touchstart'),
        } as unknown as React.TouchEvent);
      });

      // Should not start dragging
      expect(result.current.isDragging).toBe(false);
    });
  });

  describe('RAF throttling uses latest position', () => {
    it('uses the latest mouse position when multiple moves occur before RAF fires', () => {
      const onResize = vi.fn();
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
          onResize,
        })
      );

      // Start drag
      act(() => {
        const mouseDown = result.current.handleMouseDown(0);
        mouseDown({
          preventDefault: vi.fn(),
          clientX: 300,
          clientY: 0,
          nativeEvent: new MouseEvent('mousedown'),
        } as unknown as React.MouseEvent);
      });

      // Simulate multiple rapid mouse moves BEFORE RAF fires
      // This simulates what happens when mouse events fire faster than 60fps
      act(() => {
        // First move - schedules RAF
        document.dispatchEvent(
          new MouseEvent('mousemove', { clientX: 320, clientY: 0 })
        );
        // Second move - should be captured but RAF already pending
        document.dispatchEvent(
          new MouseEvent('mousemove', { clientX: 350, clientY: 0 })
        );
        // Third move - the latest position
        document.dispatchEvent(
          new MouseEvent('mousemove', { clientX: 400, clientY: 0 })
        );

        // Now RAF fires - should use position 400, not 320
        vi.runAllTimers();
      });

      // Should use the LATEST position (400), not the first one (320)
      expect(result.current.currentSizes[0]).toBe(400);
      expect(result.current.currentSizes[1]).toBe(600);
    });

    it('uses the latest touch position when multiple moves occur before RAF fires', () => {
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
        })
      );

      // Start touch
      act(() => {
        const touchStart = result.current.handleTouchStart(0);
        touchStart({
          touches: [{ clientX: 300, clientY: 0 }],
          nativeEvent: new TouchEvent('touchstart'),
        } as unknown as React.TouchEvent);
      });

      // Simulate multiple rapid touch moves BEFORE RAF fires
      act(() => {
        document.dispatchEvent(
          new TouchEvent('touchmove', {
            touches: [{ clientX: 320, clientY: 0 } as Touch],
          })
        );
        document.dispatchEvent(
          new TouchEvent('touchmove', {
            touches: [{ clientX: 350, clientY: 0 } as Touch],
          })
        );
        document.dispatchEvent(
          new TouchEvent('touchmove', {
            touches: [{ clientX: 400, clientY: 0 } as Touch],
          })
        );

        vi.runAllTimers();
      });

      // Should use the LATEST position (400)
      expect(result.current.currentSizes[0]).toBe(400);
      expect(result.current.currentSizes[1]).toBe(600);
    });
  });

  describe('event cleanup', () => {
    it('cleans up event listeners when drag ends', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
        })
      );

      // Start drag
      act(() => {
        const mouseDown = result.current.handleMouseDown(0);
        mouseDown({
          preventDefault: vi.fn(),
          clientX: 300,
          clientY: 0,
          nativeEvent: new MouseEvent('mousedown'),
        } as unknown as React.MouseEvent);
      });

      // End drag
      act(() => {
        document.dispatchEvent(new MouseEvent('mouseup'));
      });

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mouseup',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });
});
