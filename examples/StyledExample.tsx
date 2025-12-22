import React from 'react';
import { SplitPane, Pane } from '../src';
import type { DividerProps } from '../src/types';

function CustomDivider(props: DividerProps) {
  const {
    direction,
    isDragging,
    disabled,
    onMouseDown,
    onTouchStart,
    onTouchEnd,
    onKeyDown,
  } = props;

  return (
    <div
      role="separator"
      aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
      tabIndex={disabled ? -1 : 0}
      className={`custom-divider ${direction}`}
      style={{
        cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
        opacity: isDragging ? 0.8 : 1,
        userSelect: 'none',
        touchAction: 'none',
        position: 'relative',
        zIndex: 10,
      }}
      onMouseDown={disabled ? undefined : onMouseDown}
      onTouchStart={disabled ? undefined : onTouchStart}
      onTouchEnd={disabled ? undefined : onTouchEnd}
      onKeyDown={disabled ? undefined : onKeyDown}
    />
  );
}

export function StyledExample() {
  return (
    <div className="example-container">
      <div className="example-info">
        <h2>Custom Styling</h2>
        <p>
          Use custom divider components and CSS for unique looks. This example
          uses a gradient divider.
        </p>
      </div>
      <div className="example-content">
        <SplitPane direction="horizontal" divider={CustomDivider}>
          <Pane defaultSize="33%">
            <div
              className="pane-content"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <h2 style={{ color: 'white' }}>Panel 1</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                Custom gradient background
              </p>
            </div>
          </Pane>
          <Pane defaultSize="34%">
            <div
              className="pane-content"
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              }}
            >
              <h2 style={{ color: 'white' }}>Panel 2</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                The divider is a custom component
              </p>
              <div
                className="code-block"
                style={{ background: 'rgba(0,0,0,0.3)' }}
              >
                <code style={{ color: 'white' }}>
                  {`<SplitPane divider={CustomDivider}>
  <Pane>...</Pane>
  <Pane>...</Pane>
</SplitPane>`}
                </code>
              </div>
            </div>
          </Pane>
          <Pane defaultSize="33%">
            <div
              className="pane-content"
              style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              }}
            >
              <h2 style={{ color: 'white' }}>Panel 3</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                Three panes supported
              </p>
            </div>
          </Pane>
        </SplitPane>
      </div>
    </div>
  );
}
