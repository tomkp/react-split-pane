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
      className={`custom-divider ${direction}${isDragging ? ' dragging' : ''}`}
      onMouseDown={disabled ? undefined : onMouseDown}
      onTouchStart={disabled ? undefined : onTouchStart}
      onTouchEnd={disabled ? undefined : onTouchEnd}
      onKeyDown={disabled ? undefined : onKeyDown}
    />
  );
}

export function StyledExample() {
  return (
    <div className="example-container styled-example">
      <div className="example-header">
        <h2>Custom Divider</h2>
        <p>Use a custom divider component for different styles.</p>
      </div>
      <div className="example-content">
        <SplitPane direction="horizontal" divider={CustomDivider}>
          <Pane defaultSize="33%">
            <div className="pane styled-pane purple">
              <h3>Panel 1</h3>
            </div>
          </Pane>
          <Pane defaultSize="34%">
            <div className="pane styled-pane pink">
              <h3>Panel 2</h3>
              <div className="code dark">
                <code>
                  {`<SplitPane divider={CustomDivider}>
  <Pane>...</Pane>
</SplitPane>`}
                </code>
              </div>
            </div>
          </Pane>
          <Pane defaultSize="33%">
            <div className="pane styled-pane blue">
              <h3>Panel 3</h3>
            </div>
          </Pane>
        </SplitPane>
      </div>
    </div>
  );
}
