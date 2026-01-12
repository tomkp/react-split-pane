import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { SplitPane } from './SplitPane';
import { Pane } from './Pane';
import { triggerResize, clearResizeObservers } from '../test/setup';

// These match the mock in test/setup.ts
const CONTAINER_WIDTH = 1024;
const CONTAINER_HEIGHT = 768;

describe('SplitPane', () => {
  beforeEach(() => {
    clearResizeObservers();
  });

  it('renders children panes', async () => {
    render(
      <SplitPane>
        <Pane>
          <div>Pane 1</div>
        </Pane>
        <Pane>
          <div>Pane 2</div>
        </Pane>
      </SplitPane>
    );

    // Flush state updates from ResizeObserver callback
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(screen.getByText('Pane 1')).toBeInTheDocument();
    expect(screen.getByText('Pane 2')).toBeInTheDocument();
  });

  it('renders divider between panes', async () => {
    const { container } = render(
      <SplitPane>
        <Pane>Pane 1</Pane>
        <Pane>Pane 2</Pane>
      </SplitPane>
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const divider = container.querySelector('[role="separator"]');
    expect(divider).toBeInTheDocument();
  });

  it('applies horizontal direction class by default', () => {
    const { container } = render(
      <SplitPane>
        <Pane>Pane 1</Pane>
        <Pane>Pane 2</Pane>
      </SplitPane>
    );

    const splitPane = container.querySelector('.split-pane');
    expect(splitPane).toHaveClass('horizontal');
  });

  it('applies vertical direction class when specified', () => {
    const { container } = render(
      <SplitPane direction="vertical">
        <Pane>Pane 1</Pane>
        <Pane>Pane 2</Pane>
      </SplitPane>
    );

    const splitPane = container.querySelector('.split-pane');
    expect(splitPane).toHaveClass('vertical');
  });

  it('applies custom className', () => {
    const { container } = render(
      <SplitPane className="custom-class">
        <Pane>Pane 1</Pane>
        <Pane>Pane 2</Pane>
      </SplitPane>
    );

    const splitPane = container.querySelector('.split-pane');
    expect(splitPane).toHaveClass('custom-class');
  });

  it('renders correct number of dividers for multiple panes', async () => {
    const { container } = render(
      <SplitPane>
        <Pane>Pane 1</Pane>
        <Pane>Pane 2</Pane>
        <Pane>Pane 3</Pane>
      </SplitPane>
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const dividers = container.querySelectorAll('[role="separator"]');
    expect(dividers).toHaveLength(2); // n-1 dividers for n panes
  });
});

describe('SplitPane initial size calculation', () => {
  // Uses ResizeObserver mock from test/setup.ts with 1024x768 dimensions

  it('distributes remaining space to panes without defaultSize', async () => {
    const { container } = render(
      <SplitPane direction="horizontal">
        <Pane defaultSize="30%">Pane 1</Pane>
        <Pane>Pane 2</Pane>
      </SplitPane>
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const panes = container.querySelectorAll('[data-pane="true"]');
    expect(panes).toHaveLength(2);

    // First pane: 30% of 1024 = 307.2px
    expect(panes[0]).toHaveStyle({ width: `${CONTAINER_WIDTH * 0.3}px` });
    // Second pane: remaining 70% = 716.8px
    expect(panes[1]).toHaveStyle({ width: `${CONTAINER_WIDTH * 0.7}px` });
  });

  it('distributes remaining space equally among multiple auto-sized panes', async () => {
    const { container } = render(
      <SplitPane direction="horizontal">
        <Pane defaultSize={200}>Pane 1</Pane>
        <Pane>Pane 2</Pane>
        <Pane>Pane 3</Pane>
      </SplitPane>
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const panes = container.querySelectorAll('[data-pane="true"]');
    expect(panes).toHaveLength(3);

    // First pane: 200px fixed
    expect(panes[0]).toHaveStyle({ width: '200px' });
    // Remaining (1024 - 200) = 824px split equally: 412px each
    const remainingEach = (CONTAINER_WIDTH - 200) / 2;
    expect(panes[1]).toHaveStyle({ width: `${remainingEach}px` });
    expect(panes[2]).toHaveStyle({ width: `${remainingEach}px` });
  });

  it('distributes space equally when no panes have defaultSize', async () => {
    const { container } = render(
      <SplitPane direction="horizontal">
        <Pane>Pane 1</Pane>
        <Pane>Pane 2</Pane>
      </SplitPane>
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const panes = container.querySelectorAll('[data-pane="true"]');
    expect(panes).toHaveLength(2);

    // Each pane gets 50% = 512px
    const halfWidth = CONTAINER_WIDTH / 2;
    expect(panes[0]).toHaveStyle({ width: `${halfWidth}px` });
    expect(panes[1]).toHaveStyle({ width: `${halfWidth}px` });
  });

  it('handles percentage defaultSize correctly', async () => {
    const { container } = render(
      <SplitPane direction="horizontal">
        <Pane defaultSize="25%">Pane 1</Pane>
        <Pane defaultSize="25%">Pane 2</Pane>
        <Pane>Pane 3</Pane>
      </SplitPane>
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const panes = container.querySelectorAll('[data-pane="true"]');
    expect(panes).toHaveLength(3);

    // First two panes: 25% each = 256px
    const quarterWidth = CONTAINER_WIDTH * 0.25;
    expect(panes[0]).toHaveStyle({ width: `${quarterWidth}px` });
    expect(panes[1]).toHaveStyle({ width: `${quarterWidth}px` });
    // Third pane: remaining 50% = 512px
    expect(panes[2]).toHaveStyle({ width: `${CONTAINER_WIDTH * 0.5}px` });
  });

  it('handles vertical direction correctly', async () => {
    const { container } = render(
      <SplitPane direction="vertical">
        <Pane defaultSize="25%">Pane 1</Pane>
        <Pane>Pane 2</Pane>
      </SplitPane>
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const panes = container.querySelectorAll('[data-pane="true"]');
    expect(panes).toHaveLength(2);

    // First pane: 25% of 768 = 192px
    expect(panes[0]).toHaveStyle({ height: `${CONTAINER_HEIGHT * 0.25}px` });
    // Second pane: remaining 75% = 576px
    expect(panes[1]).toHaveStyle({ height: `${CONTAINER_HEIGHT * 0.75}px` });
  });

  it('respects controlled size prop over defaultSize', async () => {
    const { container } = render(
      <SplitPane direction="horizontal">
        <Pane size={400} defaultSize="30%">
          Pane 1
        </Pane>
        <Pane>Pane 2</Pane>
      </SplitPane>
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const panes = container.querySelectorAll('[data-pane="true"]');
    expect(panes).toHaveLength(2);

    // First pane: controlled size of 400px (not 30%)
    expect(panes[0]).toHaveStyle({ width: '400px' });
    // Second pane: remaining 624px
    expect(panes[1]).toHaveStyle({ width: `${CONTAINER_WIDTH - 400}px` });
  });

  it('updates pane sizes when controlled size prop changes', async () => {
    const ControlledComponent = ({ sizes }: { sizes: number[] }) => (
      <SplitPane direction="horizontal">
        <Pane size={sizes[0]}>Pane 1</Pane>
        <Pane size={sizes[1]}>Pane 2</Pane>
      </SplitPane>
    );

    const { container, rerender } = render(
      <ControlledComponent sizes={[200, 400]} />
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const panes = container.querySelectorAll('[data-pane="true"]');
    expect(panes).toHaveLength(2);
    expect(panes[0]).toHaveStyle({ width: '200px' });
    expect(panes[1]).toHaveStyle({ width: '400px' });

    // Change sizes (simulates parent state update after drag)
    rerender(<ControlledComponent sizes={[300, 300]} />);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(panes[0]).toHaveStyle({ width: '300px' });
    expect(panes[1]).toHaveStyle({ width: '300px' });

    // Reset to initial values (simulates clicking "Reset" button)
    rerender(<ControlledComponent sizes={[200, 400]} />);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // This is the bug: sizes should update to [200, 400]
    expect(panes[0]).toHaveStyle({ width: '200px' });
    expect(panes[1]).toHaveStyle({ width: '400px' });
  });
});

describe('SplitPane container resize behavior', () => {
  beforeEach(() => {
    clearResizeObservers();
  });

  it('maintains controlled pixel sizes when container resizes', async () => {
    const onResize = vi.fn();
    const sizesAfterResize: number[][] = [];

    // Custom SplitPane wrapper to capture intermediate sizes
    const CapturingSplitPane = () => {
      return (
        <SplitPane
          direction="horizontal"
          onResize={(sizes) => {
            sizesAfterResize.push([...sizes]);
            onResize(sizes);
          }}
        >
          <Pane size={200}>Pane 1</Pane>
          <Pane size={400}>Pane 2</Pane>
        </SplitPane>
      );
    };

    const { container } = render(<CapturingSplitPane />);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const panes = container.querySelectorAll('[data-pane="true"]');
    expect(panes).toHaveLength(2);

    // Initial sizes should be respected
    expect(panes[0]).toHaveStyle({ width: '200px' });
    expect(panes[1]).toHaveStyle({ width: '400px' });

    // Simulate container resize (window resize)
    act(() => {
      triggerResize(1200, 768);
    });

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // After all updates, sizes should be maintained
    expect(panes[0]).toHaveStyle({ width: '200px' });
    expect(panes[1]).toHaveStyle({ width: '400px' });

    // onResize should NOT be called for container resize (only for user drag)
    // If onResize was called, it means distributeSizes was incorrectly applied
    expect(onResize).not.toHaveBeenCalled();
  });

  it('distributes uncontrolled panes proportionally on container resize', async () => {
    const { container } = render(
      <SplitPane direction="horizontal">
        <Pane defaultSize={200}>Pane 1</Pane>
        <Pane>Pane 2</Pane>
      </SplitPane>
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const panes = container.querySelectorAll('[data-pane="true"]');

    // Initial: 200px + 824px = 1024px
    expect(panes[0]).toHaveStyle({ width: '200px' });
    expect(panes[1]).toHaveStyle({ width: `${CONTAINER_WIDTH - 200}px` });

    // Simulate container resize to 2048px (double)
    await act(async () => {
      triggerResize(2048, 768);
      await vi.runAllTimersAsync();
    });

    // Uncontrolled panes should scale proportionally
    expect(panes[0]).toHaveStyle({ width: '400px' });
    expect(panes[1]).toHaveStyle({ width: `${2048 - 400}px` });
  });

  it('maintains controlled sizes in vertical direction on container resize', async () => {
    const { container } = render(
      <SplitPane direction="vertical">
        <Pane size={200}>Pane 1</Pane>
        <Pane size={300}>Pane 2</Pane>
      </SplitPane>
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const panes = container.querySelectorAll('[data-pane="true"]');

    expect(panes[0]).toHaveStyle({ height: '200px' });
    expect(panes[1]).toHaveStyle({ height: '300px' });

    // Simulate container resize
    await act(async () => {
      triggerResize(1024, 1000);
      await vi.runAllTimersAsync();
    });

    // Controlled sizes should be maintained
    expect(panes[0]).toHaveStyle({ height: '200px' });
    expect(panes[1]).toHaveStyle({ height: '300px' });
  });
});
