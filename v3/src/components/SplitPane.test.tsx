import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { SplitPane } from './SplitPane';
import { Pane } from './Pane';

describe('SplitPane', () => {
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
