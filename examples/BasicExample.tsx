import React, { useState } from 'react';
import { SplitPane, Pane } from '../src';

export function BasicExample() {
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>(
    'horizontal'
  );

  return (
    <div className="example-container">
      <div className="example-header">
        <h2>Basic Split Pane</h2>
        <p>
          A simple two-pane layout.{' '}
          <button
            className="btn"
            onClick={() =>
              setDirection((d) =>
                d === 'horizontal' ? 'vertical' : 'horizontal'
              )
            }
          >
            {direction}
          </button>
        </p>
      </div>
      <div className="example-content">
        <SplitPane direction={direction}>
          <Pane minSize={100} defaultSize="30%">
            <div className="pane gray">
              <h3>Left Pane</h3>
              <p>minSize: 100px</p>
            </div>
          </Pane>
          <Pane minSize={100}>
            <div className="pane">
              <h3>Right Pane</h3>
              <p>Drag the divider to resize.</p>
              <div className="code">
                <code>
                  {`<SplitPane direction="${direction}">
  <Pane minSize={100}>Left</Pane>
  <Pane>Right</Pane>
</SplitPane>`}
                </code>
              </div>
            </div>
          </Pane>
        </SplitPane>
      </div>
    </div>
  );
}
