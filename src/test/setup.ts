import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Use fake timers globally
vi.useFakeTimers();

// Polyfill PointerEvent for jsdom (which doesn't include it)
class MockPointerEvent extends MouseEvent {
  readonly pointerId: number;
  readonly pointerType: string;
  readonly width: number;
  readonly height: number;
  readonly pressure: number;
  readonly tangentialPressure: number;
  readonly tiltX: number;
  readonly tiltY: number;
  readonly twist: number;
  readonly isPrimary: boolean;

  constructor(type: string, init?: PointerEventInit) {
    super(type, init);
    this.pointerId = init?.pointerId ?? 0;
    this.pointerType = init?.pointerType ?? 'mouse';
    this.width = init?.width ?? 1;
    this.height = init?.height ?? 1;
    this.pressure = init?.pressure ?? 0;
    this.tangentialPressure = init?.tangentialPressure ?? 0;
    this.tiltX = init?.tiltX ?? 0;
    this.tiltY = init?.tiltY ?? 0;
    this.twist = init?.twist ?? 0;
    this.isPrimary = init?.isPrimary ?? true;
  }

  getCoalescedEvents(): PointerEvent[] {
    return [];
  }

  getPredictedEvents(): PointerEvent[] {
    return [];
  }
}

(globalThis as unknown as { PointerEvent: typeof PointerEvent }).PointerEvent =
  MockPointerEvent as unknown as typeof PointerEvent;

// Mock getBoundingClientRect to return proper dimensions
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 1024,
  height: 768,
  top: 0,
  left: 0,
  bottom: 768,
  right: 1024,
  x: 0,
  y: 0,
  toJSON: () => ({}),
}));

// Store observers to allow triggering resize events in tests
type ObserverEntry = {
  callback: ResizeObserverCallback;
  observer: ResizeObserver;
  target: Element;
};
const resizeObservers: ObserverEntry[] = [];

// Helper to trigger resize on observed elements
export function triggerResize(width: number, height: number) {
  resizeObservers.forEach(({ callback, observer, target }) => {
    const mockEntry = {
      target,
      contentRect: {
        width,
        height,
        top: 0,
        left: 0,
        bottom: height,
        right: width,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      },
      borderBoxSize: [],
      contentBoxSize: [],
      devicePixelContentBoxSize: [],
    } as unknown as ResizeObserverEntry;

    callback([mockEntry], observer);
  });
}

// Clear observers between tests
export function clearResizeObservers() {
  resizeObservers.length = 0;
}

// Mock ResizeObserver with callback support
(
  globalThis as unknown as {
    ResizeObserver: typeof ResizeObserver;
  }
).ResizeObserver = class ResizeObserver {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    // Store for later triggering
    resizeObservers.push({
      callback: this.callback,
      observer: this,
      target,
    });

    // Call callback synchronously for predictable testing
    const mockEntry = {
      target,
      contentRect: {
        width: 1024,
        height: 768,
        top: 0,
        left: 0,
        bottom: 768,
        right: 1024,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      },
      borderBoxSize: [],
      contentBoxSize: [],
      devicePixelContentBoxSize: [],
    } as unknown as ResizeObserverEntry;

    // Call callback synchronously
    this.callback([mockEntry], this);
  }

  unobserve() {
    // Mock implementation
  }

  disconnect() {
    // Remove from tracked observers
    const index = resizeObservers.findIndex((o) => o.observer === this);
    if (index !== -1) {
      resizeObservers.splice(index, 1);
    }
  }
};
