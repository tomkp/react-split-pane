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
    // Mock implementation
  }
};
