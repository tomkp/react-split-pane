import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { SplitPane } from './SplitPane';
import { Pane } from './Pane';
import { triggerResize, clearResizeObservers } from '../test/setup';

// These match the mock in test/setup.ts
const CONTAINER_WIDTH = 1024;
const CONTAINER_HEIGHT = 768;
const DEFAULT_DIVIDER_SIZE = 1;

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

    // Available space = container - divider = 1024 - 1 = 1023px
    const availableWidth = CONTAINER_WIDTH - DEFAULT_DIVIDER_SIZE;
    // First pane: 30% of available space (306.9px)
    const pane1Width = parseFloat((panes[0] as HTMLElement).style.width);
    expect(pane1Width).toBeCloseTo(availableWidth * 0.3, 1);
    // Second pane: remaining 70% of available space (716.1px)
    const pane2Width = parseFloat((panes[1] as HTMLElement).style.width);
    expect(pane2Width).toBeCloseTo(availableWidth * 0.7, 1);
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

    // Available space = container - (2 dividers * 1px) = 1024 - 2 = 1022px
    const availableWidth = CONTAINER_WIDTH - DEFAULT_DIVIDER_SIZE * 2;
    // First pane: 200px fixed
    expect(panes[0]).toHaveStyle({ width: '200px' });
    // Remaining (1022 - 200) = 822px split equally: 411px each
    const remainingEach = (availableWidth - 200) / 2;
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

    // Available space = container - divider = 1024 - 1 = 1023px
    // Each pane gets 50% = 511.5px
    const availableWidth = CONTAINER_WIDTH - DEFAULT_DIVIDER_SIZE;
    const halfWidth = availableWidth / 2;
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

    // Available space = container - (2 dividers * 1px) = 1024 - 2 = 1022px
    const availableWidth = CONTAINER_WIDTH - DEFAULT_DIVIDER_SIZE * 2;
    // First two panes: 25% each of available space
    const quarterWidth = availableWidth * 0.25;
    expect(panes[0]).toHaveStyle({ width: `${quarterWidth}px` });
    expect(panes[1]).toHaveStyle({ width: `${quarterWidth}px` });
    // Third pane: remaining 50% of available space
    expect(panes[2]).toHaveStyle({ width: `${availableWidth * 0.5}px` });
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

    // Available height = container - divider = 768 - 1 = 767px
    const availableHeight = CONTAINER_HEIGHT - DEFAULT_DIVIDER_SIZE;
    // First pane: 25% of available height
    expect(panes[0]).toHaveStyle({ height: `${availableHeight * 0.25}px` });
    // Second pane: remaining 75% of available height
    expect(panes[1]).toHaveStyle({ height: `${availableHeight * 0.75}px` });
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

    // Available space = container - divider = 1024 - 1 = 1023px
    const availableWidth = CONTAINER_WIDTH - DEFAULT_DIVIDER_SIZE;
    // First pane: controlled size of 400px (not 30%)
    expect(panes[0]).toHaveStyle({ width: '400px' });
    // Second pane: remaining available space minus first pane
    expect(panes[1]).toHaveStyle({ width: `${availableWidth - 400}px` });
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

    // Available space = container - divider = 1024 - 1 = 1023px
    const initialAvailable = CONTAINER_WIDTH - DEFAULT_DIVIDER_SIZE;
    // Initial: 200px + 823px = 1023px (available space)
    expect(panes[0]).toHaveStyle({ width: '200px' });
    expect(panes[1]).toHaveStyle({ width: `${initialAvailable - 200}px` });

    // Simulate container resize to 2048px (double)
    await act(async () => {
      triggerResize(2048, 768);
      await vi.runAllTimersAsync();
    });

    // Available space at new size = 2048 - 1 = 2047px
    const newAvailable = 2048 - DEFAULT_DIVIDER_SIZE;
    // Uncontrolled panes should scale proportionally
    // Original ratio: 200/1023 and 823/1023
    const expectedPane1 = (200 / initialAvailable) * newAvailable;
    const expectedPane2 =
      ((initialAvailable - 200) / initialAvailable) * newAvailable;
    expect(panes[0]).toHaveStyle({ width: `${expectedPane1}px` });
    expect(panes[1]).toHaveStyle({ width: `${expectedPane2}px` });
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

describe('SplitPane divider size accounting', () => {
  beforeEach(() => {
    clearResizeObservers();
  });

  it('accounts for divider width when calculating percentage-based pane sizes', async () => {
    // Custom divider with a known width
    const DividerWithWidth = (props: {
      direction: string;
      onMouseDown?: () => void;
      onTouchStart?: () => void;
      onTouchEnd?: () => void;
      onKeyDown?: () => void;
    }) => (
      <div
        role="separator"
        style={{ width: props.direction === 'horizontal' ? '10px' : undefined }}
        data-testid="divider"
        onMouseDown={props.onMouseDown}
        onTouchStart={props.onTouchStart}
        onTouchEnd={props.onTouchEnd}
        onKeyDown={props.onKeyDown}
      />
    );

    const { container } = render(
      <SplitPane
        direction="horizontal"
        divider={DividerWithWidth}
        dividerSize={10}
      >
        <Pane defaultSize="33%">Pane 1</Pane>
        <Pane defaultSize="34%">Pane 2</Pane>
        <Pane defaultSize="33%">Pane 3</Pane>
      </SplitPane>
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const panes = container.querySelectorAll('[data-pane="true"]');
    expect(panes).toHaveLength(3);

    // Get actual pane widths
    const pane1Width = parseFloat(
      (panes[0] as HTMLElement).style.width.replace('px', '')
    );
    const pane2Width = parseFloat(
      (panes[1] as HTMLElement).style.width.replace('px', '')
    );
    const pane3Width = parseFloat(
      (panes[2] as HTMLElement).style.width.replace('px', '')
    );

    // With 2 dividers at 10px each, available space for panes is 1024 - 20 = 1004px
    // Currently the bug causes panes to total 100% of 1024 = 1024px (overflow!)
    // After fix: panes should total 1004px (accounting for divider widths)
    const totalPaneWidth = pane1Width + pane2Width + pane3Width;
    const dividerWidth = 10;
    const dividerCount = 2;
    const expectedTotalPaneWidth =
      CONTAINER_WIDTH - dividerWidth * dividerCount;

    // The total pane width should not exceed container minus dividers
    expect(totalPaneWidth).toBeLessThanOrEqual(CONTAINER_WIDTH);
    expect(totalPaneWidth).toBeCloseTo(expectedTotalPaneWidth, 0);
  });

  it('accounts for default 1px divider width in size calculations', async () => {
    const { container } = render(
      <SplitPane direction="horizontal">
        <Pane defaultSize="50%">Pane 1</Pane>
        <Pane defaultSize="50%">Pane 2</Pane>
      </SplitPane>
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const panes = container.querySelectorAll('[data-pane="true"]');
    const pane1Width = parseFloat(
      (panes[0] as HTMLElement).style.width.replace('px', '')
    );
    const pane2Width = parseFloat(
      (panes[1] as HTMLElement).style.width.replace('px', '')
    );

    // With 1 divider at 1px, available space is 1024 - 1 = 1023px
    // Each pane should be 50% of 1023 = 511.5px
    const totalPaneWidth = pane1Width + pane2Width;
    const expectedTotal = CONTAINER_WIDTH - 1; // minus 1px divider

    expect(totalPaneWidth).toBeCloseTo(expectedTotal, 0);
  });
});

describe('SplitPane resize stability', () => {
  beforeEach(() => {
    clearResizeObservers();
  });

  it('ignores sub-pixel size changes to prevent resize loops', async () => {
    const onResize = vi.fn();
    const { container } = render(
      <SplitPane direction="vertical" onResize={onResize}>
        <Pane defaultSize="50%">Pane 1</Pane>
        <Pane defaultSize="50%">Pane 2</Pane>
      </SplitPane>
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const panes = container.querySelectorAll('[data-pane="true"]');
    const initialHeight1 = (panes[0] as HTMLElement).style.height;

    // Simulate multiple resize events with sub-pixel variations
    // This mimics the feedback loop scenario where content causes tiny size changes
    await act(async () => {
      triggerResize(1024, 768.2);
      await vi.runAllTimersAsync();
    });

    await act(async () => {
      triggerResize(1024, 768.4);
      await vi.runAllTimersAsync();
    });

    await act(async () => {
      triggerResize(1024, 768.1);
      await vi.runAllTimersAsync();
    });

    // Pane sizes should remain stable - sub-pixel changes shouldn't cause updates
    const finalHeight1 = (panes[0] as HTMLElement).style.height;
    expect(finalHeight1).toBe(initialHeight1);

    // onResize should NOT be called for container resize (only user drag)
    expect(onResize).not.toHaveBeenCalled();
  });

  it('still responds to significant size changes', async () => {
    const { container } = render(
      <SplitPane direction="vertical">
        <Pane defaultSize="50%">Pane 1</Pane>
        <Pane defaultSize="50%">Pane 2</Pane>
      </SplitPane>
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const panes = container.querySelectorAll('[data-pane="true"]');

    // Initial height with 768px container (minus 1px divider = 767px available)
    const initialHeight1 = parseFloat(
      (panes[0] as HTMLElement).style.height.replace('px', '')
    );
    expect(initialHeight1).toBeCloseTo(383.5, 1); // 50% of 767

    // Simulate significant resize (double the height)
    await act(async () => {
      triggerResize(1024, 1536);
      await vi.runAllTimersAsync();
    });

    // Should respond to significant change (1536 - 1 = 1535 available)
    const newHeight1 = parseFloat(
      (panes[0] as HTMLElement).style.height.replace('px', '')
    );
    expect(newHeight1).toBeCloseTo(767.5, 1); // 50% of 1535
  });
});
