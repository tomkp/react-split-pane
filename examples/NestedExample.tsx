import React from 'react';
import { SplitPane, Pane } from '../src';

export function NestedExample() {
  return (
    <div className="example-container">
      <div className="example-header">
        <h2>Nested Split Panes</h2>
        <p>Create complex layouts by nesting split panes.</p>
      </div>
      <div className="example-content">
        <SplitPane direction="horizontal">
          <Pane minSize={100} defaultSize={200}>
            <div className="pane gray">
              <h3>Sidebar</h3>
            </div>
          </Pane>
          <Pane minSize={200}>
            <SplitPane direction="vertical">
              <Pane minSize={100}>
                <div className="pane">
                  <h3>Main</h3>
                </div>
              </Pane>
              <Pane minSize={80} defaultSize={150}>
                <div className="pane gray">
                  <h3>Panel</h3>
                </div>
              </Pane>
            </SplitPane>
          </Pane>
        </SplitPane>
      </div>
    </div>
  );
}
