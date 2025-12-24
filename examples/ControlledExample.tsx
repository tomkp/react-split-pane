import React, { useState } from 'react';
import { SplitPane, Pane } from '../src';

export function ControlledExample() {
  const [sizes, setSizes] = useState<number[]>([200, 400]);

  return (
    <div className="example-container">
      <div className="example-header">
        <h2>Controlled</h2>
        <p>
          Sizes are controlled via state.{' '}
          <button className="btn" onClick={() => setSizes([200, 400])}>
            Reset
          </button>
        </p>
      </div>
      <div className="example-content">
        <SplitPane direction="horizontal" onResize={setSizes}>
          <Pane size={sizes[0]} minSize={100}>
            <div className="pane gray">
              <h3>Panel A</h3>
              <p className="size-display">{Math.round(sizes[0])}px</p>
            </div>
          </Pane>
          <Pane size={sizes[1]} minSize={100}>
            <div className="pane">
              <h3>Panel B</h3>
              <p className="size-display">{Math.round(sizes[1])}px</p>
              <div className="code">
                <code>
                  {`const [sizes, setSizes] = useState([200, 400]);

<SplitPane onResize={setSizes}>
  <Pane size={sizes[0]}>A</Pane>
  <Pane size={sizes[1]}>B</Pane>
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
