import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useResizer } from './useResizer';

// Helper to create a mock element with pointer capture methods
function createMockElement(): HTMLDivElement {
  const element = document.createElement('div');
  element.setPointerCapture = vi.fn();
  element.releasePointerCapture = vi.fn();
  element.hasPointerCapture = vi.fn().mockReturnValue(true);
  return element;
}

// Helper to create a PointerEvent with required properties
function createPointerEvent(
  type: string,
  options: { clientX?: number; clientY?: number; pointerId?: number } = {}
): PointerEvent {
  return new PointerEvent(type, {
    clientX: options.clientX ?? 0,
    clientY: options.clientY ?? 0,
    pointerId: options.pointerId ?? 1,
    bubbles: true,
  });
}

// Helper to create a mock React PointerEvent with nativeEvent
function createMockReactPointerEvent(
  mockElement: HTMLDivElement,
  options: {
    clientX?: number;
    clientY?: number;
    pointerId?: number;
    pointerType?: string;
  } = {}
): React.PointerEvent {
  const nativeEvent = new PointerEvent('pointerdown', {
    clientX: options.clientX ?? 0,
    clientY: options.clientY ?? 0,
    pointerId: options.pointerId ?? 1,
    pointerType: options.pointerType ?? 'mouse',
    bubbles: true,
  });

  return {
    preventDefault: vi.fn(),
    clientX: options.clientX ?? 0,
    clientY: options.clientY ?? 0,
    pointerId: options.pointerId ?? 1,
    pointerType: options.pointerType ?? 'mouse',
    currentTarget: mockElement,
    nativeEvent,
  } as unknown as React.PointerEvent;
}

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
      const mockElement = createMockElement();
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

      // Start a drag using pointer events
      act(() => {
        const pointerDown = result.current.handlePointerDown(0);
        const event = createPointerEvent('pointerdown', {
          clientX: 300,
          clientY: 0,
          pointerId: 1,
        });
        Object.defineProperty(event, 'currentTarget', { value: mockElement });
        pointerDown(event as unknown as React.PointerEvent);
      });

      expect(result.current.isDragging).toBe(true);

      // Try to update sizes from prop
      rerender({ sizes: [400, 600] });

      // Should still be the original sizes since we're dragging
      expect(result.current.currentSizes).toEqual([300, 700]);
    });
  });

  describe('pointer drag interactions', () => {
    it('starts dragging on pointerDown and captures pointer', () => {
      const mockElement = createMockElement();
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
        const pointerDown = result.current.handlePointerDown(0);
        const event = createMockReactPointerEvent(mockElement, {
          clientX: 300,
          clientY: 0,
          pointerId: 1,
        });
        pointerDown(event);
      });

      expect(result.current.isDragging).toBe(true);
      expect(mockElement.setPointerCapture).toHaveBeenCalledWith(1);
      expect(onResizeStart).toHaveBeenCalledWith({
        sizes: [300, 700],
        source: 'pointer',
        originalEvent: expect.any(PointerEvent),
      });
    });

    it('updates sizes during horizontal drag', () => {
      const mockElement = createMockElement();
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
        const pointerDown = result.current.handlePointerDown(0);
        const event = createPointerEvent('pointerdown', {
          clientX: 300,
          clientY: 0,
          pointerId: 1,
        });
        Object.defineProperty(event, 'currentTarget', { value: mockElement });
        pointerDown(event as unknown as React.PointerEvent);
      });

      // Simulate pointer move (document level event)
      act(() => {
        const pointerMoveEvent = createPointerEvent('pointermove', {
          clientX: 350,
          clientY: 0,
          pointerId: 1,
        });
        document.dispatchEvent(pointerMoveEvent);
        vi.runAllTimers(); // RAF is mocked with timers
      });

      expect(onResize).toHaveBeenCalled();
      expect(result.current.currentSizes[0]).toBe(350);
      expect(result.current.currentSizes[1]).toBe(650);
    });

    it('updates sizes during vertical drag', () => {
      const mockElement = createMockElement();
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
        const pointerDown = result.current.handlePointerDown(0);
        const event = createPointerEvent('pointerdown', {
          clientX: 0,
          clientY: 300,
          pointerId: 1,
        });
        Object.defineProperty(event, 'currentTarget', { value: mockElement });
        pointerDown(event as unknown as React.PointerEvent);
      });

      // Simulate vertical pointer move
      act(() => {
        const pointerMoveEvent = createPointerEvent('pointermove', {
          clientX: 0,
          clientY: 350,
          pointerId: 1,
        });
        document.dispatchEvent(pointerMoveEvent);
        vi.runAllTimers();
      });

      expect(result.current.currentSizes[0]).toBe(350);
      expect(result.current.currentSizes[1]).toBe(450);
    });

    it('ends drag on pointerUp and releases pointer capture', () => {
      const mockElement = createMockElement();
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
        const pointerDown = result.current.handlePointerDown(0);
        const event = createPointerEvent('pointerdown', {
          clientX: 300,
          clientY: 0,
          pointerId: 1,
        });
        Object.defineProperty(event, 'currentTarget', { value: mockElement });
        pointerDown(event as unknown as React.PointerEvent);
      });

      expect(result.current.isDragging).toBe(true);

      // End drag
      act(() => {
        const pointerUpEvent = createPointerEvent('pointerup', {
          pointerId: 1,
        });
        document.dispatchEvent(pointerUpEvent);
      });

      expect(result.current.isDragging).toBe(false);
      expect(onResizeEnd).toHaveBeenCalledWith([300, 700], {
        sizes: [300, 700],
        source: 'pointer',
      });
    });

    it('ends drag on pointerCancel and releases pointer capture', () => {
      const mockElement = createMockElement();
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
        const pointerDown = result.current.handlePointerDown(0);
        const event = createPointerEvent('pointerdown', {
          clientX: 300,
          clientY: 0,
          pointerId: 1,
        });
        Object.defineProperty(event, 'currentTarget', { value: mockElement });
        pointerDown(event as unknown as React.PointerEvent);
      });

      expect(result.current.isDragging).toBe(true);

      // Cancel drag
      act(() => {
        const pointerCancelEvent = createPointerEvent('pointercancel', {
          pointerId: 1,
        });
        document.dispatchEvent(pointerCancelEvent);
      });

      expect(result.current.isDragging).toBe(false);
      expect(onResizeEnd).toHaveBeenCalled();
    });

    it('respects minimum size constraints', () => {
      const mockElement = createMockElement();
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
        const pointerDown = result.current.handlePointerDown(0);
        const event = createPointerEvent('pointerdown', {
          clientX: 300,
          clientY: 0,
          pointerId: 1,
        });
        Object.defineProperty(event, 'currentTarget', { value: mockElement });
        pointerDown(event as unknown as React.PointerEvent);
      });

      // Try to drag past minimum
      act(() => {
        const pointerMoveEvent = createPointerEvent('pointermove', {
          clientX: 50, // Would make first pane 50px
          clientY: 0,
          pointerId: 1,
        });
        document.dispatchEvent(pointerMoveEvent);
        vi.runAllTimers();
      });

      expect(result.current.currentSizes[0]).toBe(200); // Clamped to min
      expect(result.current.currentSizes[1]).toBe(800);
    });

    it('respects maximum size constraints', () => {
      const mockElement = createMockElement();
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
        const pointerDown = result.current.handlePointerDown(0);
        const event = createPointerEvent('pointerdown', {
          clientX: 300,
          clientY: 0,
          pointerId: 1,
        });
        Object.defineProperty(event, 'currentTarget', { value: mockElement });
        pointerDown(event as unknown as React.PointerEvent);
      });

      // Try to drag past maximum
      act(() => {
        const pointerMoveEvent = createPointerEvent('pointermove', {
          clientX: 600, // Would make first pane 600px
          clientY: 0,
          pointerId: 1,
        });
        document.dispatchEvent(pointerMoveEvent);
        vi.runAllTimers();
      });

      expect(result.current.currentSizes[0]).toBe(400); // Clamped to max
      expect(result.current.currentSizes[1]).toBe(600);
    });
  });

  describe('snap points', () => {
    it('snaps to nearby snap points', () => {
      const mockElement = createMockElement();
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
        const pointerDown = result.current.handlePointerDown(0);
        const event = createPointerEvent('pointerdown', {
          clientX: 300,
          clientY: 0,
          pointerId: 1,
        });
        Object.defineProperty(event, 'currentTarget', { value: mockElement });
        pointerDown(event as unknown as React.PointerEvent);
      });

      // Drag to position near snap point (395 should snap to 400)
      act(() => {
        const pointerMoveEvent = createPointerEvent('pointermove', {
          clientX: 395,
          clientY: 0,
          pointerId: 1,
        });
        document.dispatchEvent(pointerMoveEvent);
        vi.runAllTimers();
      });

      expect(result.current.currentSizes[0]).toBe(400); // Snapped
    });

    it('does not snap when outside tolerance', () => {
      const mockElement = createMockElement();
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
        const pointerDown = result.current.handlePointerDown(0);
        const event = createPointerEvent('pointerdown', {
          clientX: 300,
          clientY: 0,
          pointerId: 1,
        });
        Object.defineProperty(event, 'currentTarget', { value: mockElement });
        pointerDown(event as unknown as React.PointerEvent);
      });

      // Drag to position outside snap tolerance (350 is 50 away from 400)
      act(() => {
        const pointerMoveEvent = createPointerEvent('pointermove', {
          clientX: 350,
          clientY: 0,
          pointerId: 1,
        });
        document.dispatchEvent(pointerMoveEvent);
        vi.runAllTimers();
      });

      expect(result.current.currentSizes[0]).toBe(350); // No snap
    });
  });

  describe('step-based resizing', () => {
    it('applies step to drag movements', () => {
      const mockElement = createMockElement();
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
        const pointerDown = result.current.handlePointerDown(0);
        const event = createPointerEvent('pointerdown', {
          clientX: 300,
          clientY: 0,
          pointerId: 1,
        });
        Object.defineProperty(event, 'currentTarget', { value: mockElement });
        pointerDown(event as unknown as React.PointerEvent);
      });

      // Drag 73 pixels (should be rounded to 50)
      act(() => {
        const pointerMoveEvent = createPointerEvent('pointermove', {
          clientX: 373,
          clientY: 0,
          pointerId: 1,
        });
        document.dispatchEvent(pointerMoveEvent);
        vi.runAllTimers();
      });

      expect(result.current.currentSizes[0]).toBe(350); // 300 + 50
    });
  });

  describe('multiple panes', () => {
    it('handles drag on middle divider (3 panes)', () => {
      const mockElement = createMockElement();
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
        const pointerDown = result.current.handlePointerDown(1);
        const event = createPointerEvent('pointerdown', {
          clientX: 700, // Start at divider 1 position (300 + 400)
          clientY: 0,
          pointerId: 1,
        });
        Object.defineProperty(event, 'currentTarget', { value: mockElement });
        pointerDown(event as unknown as React.PointerEvent);
      });

      // Drag right by 50px
      act(() => {
        const pointerMoveEvent = createPointerEvent('pointermove', {
          clientX: 750,
          clientY: 0,
          pointerId: 1,
        });
        document.dispatchEvent(pointerMoveEvent);
        vi.runAllTimers();
      });

      expect(result.current.currentSizes[1]).toBe(450); // Increased
      expect(result.current.currentSizes[2]).toBe(250); // Decreased
      expect(result.current.currentSizes[0]).toBe(300); // Unchanged
    });
  });

  describe('pointer capture', () => {
    it('captures pointer on drag start', () => {
      const mockElement = createMockElement();
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
        })
      );

      act(() => {
        const pointerDown = result.current.handlePointerDown(0);
        const event = createPointerEvent('pointerdown', {
          clientX: 300,
          clientY: 0,
          pointerId: 42,
        });
        Object.defineProperty(event, 'currentTarget', { value: mockElement });
        pointerDown(event as unknown as React.PointerEvent);
      });

      expect(mockElement.setPointerCapture).toHaveBeenCalledWith(42);
    });

    it('handles touch input via pointer events', () => {
      const mockElement = createMockElement();
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

      // Touch generates pointer events with pointerType="touch"
      act(() => {
        const pointerDown = result.current.handlePointerDown(0);
        const event = createMockReactPointerEvent(mockElement, {
          clientX: 300,
          clientY: 0,
          pointerId: 1,
          pointerType: 'touch',
        });
        pointerDown(event);
      });

      expect(result.current.isDragging).toBe(true);
      expect(onResizeStart).toHaveBeenCalledWith({
        sizes: [300, 700],
        source: 'pointer',
        originalEvent: expect.any(PointerEvent),
      });
    });

    it('handles pen input via pointer events', () => {
      const mockElement = createMockElement();
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
        })
      );

      // Pen generates pointer events with pointerType="pen"
      act(() => {
        const pointerDown = result.current.handlePointerDown(0);
        const event = createMockReactPointerEvent(mockElement, {
          clientX: 300,
          clientY: 0,
          pointerId: 1,
          pointerType: 'pen',
        });
        pointerDown(event);
      });

      expect(result.current.isDragging).toBe(true);
    });

    it('ignores pointer events from non-captured pointers (multi-touch)', () => {
      const mockElement = createMockElement();
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

      // Start drag with pointer ID 1
      act(() => {
        const pointerDown = result.current.handlePointerDown(0);
        const event = createMockReactPointerEvent(mockElement, {
          clientX: 300,
          clientY: 0,
          pointerId: 1,
        });
        pointerDown(event);
      });

      expect(result.current.isDragging).toBe(true);

      // Simulate a second touch with different pointer ID (should be ignored)
      act(() => {
        const pointerMoveEvent = createPointerEvent('pointermove', {
          clientX: 500, // Would be a big move if processed
          clientY: 0,
          pointerId: 2, // Different pointer ID
        });
        document.dispatchEvent(pointerMoveEvent);
        vi.runAllTimers();
      });

      // Sizes should NOT change because pointer ID 2 is not captured
      expect(result.current.currentSizes).toEqual([300, 700]);
      expect(onResize).not.toHaveBeenCalled();

      // Now move with the correct pointer ID
      act(() => {
        const pointerMoveEvent = createPointerEvent('pointermove', {
          clientX: 350,
          clientY: 0,
          pointerId: 1, // Correct pointer ID
        });
        document.dispatchEvent(pointerMoveEvent);
        vi.runAllTimers();
      });

      // Sizes should change now
      expect(result.current.currentSizes[0]).toBe(350);
      expect(onResize).toHaveBeenCalled();
    });

    it('releases pointer capture on drag end', () => {
      const mockElement = createMockElement();
      const { result } = renderHook(() =>
        useResizer({
          direction: 'horizontal',
          sizes: [300, 700],
          minSizes: [100, 100],
          maxSizes: [500, 900],
        })
      );

      act(() => {
        const pointerDown = result.current.handlePointerDown(0);
        const event = createMockReactPointerEvent(mockElement, {
          clientX: 300,
          clientY: 0,
          pointerId: 42,
        });
        pointerDown(event);
      });

      expect(mockElement.setPointerCapture).toHaveBeenCalledWith(42);

      // End drag
      act(() => {
        document.dispatchEvent(
          createPointerEvent('pointerup', { pointerId: 42 })
        );
      });

      expect(mockElement.releasePointerCapture).toHaveBeenCalledWith(42);
      expect(result.current.isDragging).toBe(false);
    });
  });

  describe('RAF throttling uses latest position', () => {
    it('uses the latest pointer position when multiple moves occur before RAF fires', () => {
      const mockElement = createMockElement();
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
        const pointerDown = result.current.handlePointerDown(0);
        const event = createPointerEvent('pointerdown', {
          clientX: 300,
          clientY: 0,
          pointerId: 1,
        });
        Object.defineProperty(event, 'currentTarget', { value: mockElement });
        pointerDown(event as unknown as React.PointerEvent);
      });

      // Simulate multiple rapid pointer moves BEFORE RAF fires
      // This simulates what happens when pointer events fire faster than 60fps
      act(() => {
        // First move - schedules RAF
        document.dispatchEvent(
          createPointerEvent('pointermove', {
            clientX: 320,
            clientY: 0,
            pointerId: 1,
          })
        );
        // Second move - should be captured but RAF already pending
        document.dispatchEvent(
          createPointerEvent('pointermove', {
            clientX: 350,
            clientY: 0,
            pointerId: 1,
          })
        );
        // Third move - the latest position
        document.dispatchEvent(
          createPointerEvent('pointermove', {
            clientX: 400,
            clientY: 0,
            pointerId: 1,
          })
        );

        // Now RAF fires - should use position 400, not 320
        vi.runAllTimers();
      });

      // Should use the LATEST position (400), not the first one (320)
      expect(result.current.currentSizes[0]).toBe(400);
      expect(result.current.currentSizes[1]).toBe(600);
    });
  });

  describe('event cleanup', () => {
    it('cleans up event listeners when drag ends', () => {
      const mockElement = createMockElement();
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
        const pointerDown = result.current.handlePointerDown(0);
        const event = createPointerEvent('pointerdown', {
          clientX: 300,
          clientY: 0,
          pointerId: 1,
        });
        Object.defineProperty(event, 'currentTarget', { value: mockElement });
        pointerDown(event as unknown as React.PointerEvent);
      });

      // End drag
      act(() => {
        document.dispatchEvent(
          createPointerEvent('pointerup', { pointerId: 1 })
        );
      });

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'pointermove',
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'pointerup',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });
});
