import React, { useState, useEffect } from 'react';
import { SplitPane, Pane } from '../src';

export function NestedExample() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  return (
    <div className="example-container">
      <div className="example-info">
        <h2>Nested Split Panes</h2>
        <p>
          Create complex layouts by nesting split panes. IDE-style layout.
        </p>
      </div>
      <div className="example-content">
        <SplitPane direction={isMobile ? 'vertical' : 'horizontal'}>
          <Pane minSize={80} defaultSize={isMobile ? '30%' : 200}>
            <div className="pane-content sidebar">
              <h2>Explorer</h2>
              <div className="file-tree">
                <div className="file-tree-item folder">react-split-pane</div>
                <div
                  className="file-tree-item folder"
                  style={{ marginLeft: '1rem' }}
                >
                  src
                </div>
                <div
                  className="file-tree-item file"
                  style={{ marginLeft: '2rem' }}
                >
                  index.ts
                </div>
                <div
                  className="file-tree-item file"
                  style={{ marginLeft: '2rem' }}
                >
                  SplitPane.tsx
                </div>
                <div
                  className="file-tree-item file"
                  style={{ marginLeft: '2rem' }}
                >
                  Pane.tsx
                </div>
              </div>
            </div>
          </Pane>
          <Pane minSize={100}>
            <SplitPane direction="vertical">
              <Pane minSize={60}>
                <div className="pane-content editor">
                  <h2>Editor</h2>
                  <div className="code-block">
                    <code>
                      {`export function SplitPane(props) {
  const {
    direction = 'horizontal',
    children,
  } = props;

  return (
    <div className={className}>
      {renderChildren()}
    </div>
  );
}`}
                    </code>
                  </div>
                </div>
              </Pane>
              <Pane minSize={50} defaultSize={isMobile ? 80 : 150}>
                <div className="pane-content console">
                  <h2>Terminal</h2>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                    <div style={{ color: '#50fa7b' }}>$ npm test</div>
                    <div style={{ color: '#888', marginTop: '0.25rem' }}>
                      ✓ 14 tests passed
                    </div>
                    <div style={{ color: '#50fa7b', marginTop: '0.25rem' }}>
                      All tests passed
                    </div>
                  </div>
                </div>
              </Pane>
            </SplitPane>
          </Pane>
        </SplitPane>
      </div>
    </div>
  );
}
