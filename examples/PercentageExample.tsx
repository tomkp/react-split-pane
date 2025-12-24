import React from 'react';
import { SplitPane, Pane } from '../src';

export function PercentageExample() {
  return (
    <div className="example-container">
      <div className="example-header">
        <h2>Percentage Sizes</h2>
        <p>Use percentage values for responsive layouts.</p>
      </div>
      <div className="example-content">
        <SplitPane direction="horizontal">
          <Pane defaultSize="25%">
            <div className="pane gray">
              <h3>25%</h3>
            </div>
          </Pane>
          <Pane defaultSize="50%">
            <div className="pane">
              <h3>50%</h3>
              <div className="code">
                <code>
                  {`<SplitPane>
  <Pane defaultSize="25%">A</Pane>
  <Pane defaultSize="50%">B</Pane>
  <Pane defaultSize="25%">C</Pane>
</SplitPane>`}
                </code>
              </div>
            </div>
          </Pane>
          <Pane defaultSize="25%">
            <div className="pane gray">
              <h3>25%</h3>
            </div>
          </Pane>
        </SplitPane>
      </div>
    </div>
  );
}
