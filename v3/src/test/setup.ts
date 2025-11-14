import '@testing-library/jest-dom';

// Mock ResizeObserver with callback support
(globalThis as any).ResizeObserver = class ResizeObserver {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    // Call callback async to simulate real ResizeObserver behavior
    setTimeout(() => {
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
        },
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as ResizeObserverEntry;

      // Call callback with mock data
      this.callback([mockEntry], this);
    }, 0);
  }

  unobserve() {
    // Mock implementation
  }

  disconnect() {
    // Mock implementation
  }
};

// Mock requestAnimationFrame
(globalThis as any).requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 0) as unknown as number;
};

(globalThis as any).cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};
