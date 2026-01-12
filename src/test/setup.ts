import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Use fake timers globally
vi.useFakeTimers();

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
