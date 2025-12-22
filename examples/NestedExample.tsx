import React from 'react';
import { SplitPane, Pane } from '../src';

export function NestedExample() {
  return (
    <div className="example-container">
      <div className="example-info">
        <h2>Nested Split Panes</h2>
        <p>
          Create complex layouts by nesting split panes. This shows a typical
          IDE layout.
        </p>
      </div>
      <div className="example-content">
        <SplitPane direction="horizontal">
          <Pane minSize={150} defaultSize={200}>
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
                <div
                  className="file-tree-item folder"
                  style={{ marginLeft: '1rem' }}
                >
                  examples
                </div>
                <div
                  className="file-tree-item file"
                  style={{ marginLeft: '2rem' }}
                >
                  BasicExample.tsx
                </div>
                <div
                  className="file-tree-item file"
                  style={{ marginLeft: '2rem' }}
                >
                  NestedExample.tsx
                </div>
                <div
                  className="file-tree-item file"
                  style={{ marginLeft: '1rem' }}
                >
                  package.json
                </div>
                <div
                  className="file-tree-item file"
                  style={{ marginLeft: '1rem' }}
                >
                  README.md
                </div>
              </div>
            </div>
          </Pane>
          <Pane>
            <SplitPane direction="vertical">
              <Pane minSize={100}>
                <div className="pane-content editor">
                  <h2>Editor - SplitPane.tsx</h2>
                  <div className="code-block">
                    <code>
                      {`export function SplitPane(props: SplitPaneProps) {
  const {
    direction = 'horizontal',
    resizable = true,
    children,
  } = props;

  return (
    <div className={containerClassName}>
      {renderChildren()}
    </div>
  );
}`}
                    </code>
                  </div>
                </div>
              </Pane>
              <Pane minSize={80} defaultSize={150}>
                <div className="pane-content console">
                  <h2>Terminal</h2>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                    <div style={{ color: '#50fa7b' }}>$ npm test</div>
                    <div style={{ color: '#888', marginTop: '0.25rem' }}>
                      ✓ src/utils/calculations.test.ts (14 tests)
                    </div>
                    <div style={{ color: '#888' }}>
                      ✓ src/components/SplitPane.test.tsx (6 tests)
                    </div>
                    <div style={{ color: '#50fa7b', marginTop: '0.25rem' }}>
                      Tests: 20 passed
                    </div>
                    <div
                      style={{
                        color: '#888',
                        marginTop: '0.5rem',
                        animation: 'blink 1s infinite',
                      }}
                    >
                      $
                      <span
                        style={{
                          display: 'inline-block',
                          width: '8px',
                          height: '14px',
                          background: '#50fa7b',
                          marginLeft: '4px',
                        }}
                      />
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
