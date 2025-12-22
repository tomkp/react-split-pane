import React, { useState } from 'react';
import { SplitPane, Pane } from '../src';

export function BasicExample() {
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>(
    'horizontal'
  );

  return (
    <div className="example-container">
      <div className="example-info">
        <h2>Basic Split Pane</h2>
        <p>
          A simple two-pane layout. Click to toggle direction.{' '}
          <button
            onClick={() =>
              setDirection((d) =>
                d === 'horizontal' ? 'vertical' : 'horizontal'
              )
            }
            style={{
              padding: '0.25rem 0.5rem',
              marginLeft: '0.5rem',
              background: '#e94560',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {direction}
          </button>
        </p>
      </div>
      <div className="example-content">
        <SplitPane direction={direction}>
          <Pane minSize={100} defaultSize="30%">
            <div className="pane-content sidebar">
              <h2>Sidebar</h2>
              <p>
                This pane has a minimum size of 100px and starts at 30% width.
              </p>
              <div className="file-tree">
                <div className="file-tree-item folder">src</div>
                <div
                  className="file-tree-item file"
                  style={{ marginLeft: '1rem' }}
                >
                  index.ts
                </div>
                <div
                  className="file-tree-item file"
                  style={{ marginLeft: '1rem' }}
                >
                  App.tsx
                </div>
                <div className="file-tree-item folder">components</div>
                <div className="file-tree-item folder">styles</div>
              </div>
            </div>
          </Pane>
          <Pane minSize={200}>
            <div className="pane-content editor">
              <h2>Main Content</h2>
              <p>
                Drag the divider to resize. Use arrow keys when focused for
                keyboard control.
              </p>
              <div className="code-block">
                <code>
                  {`import { SplitPane, Pane } from 'react-split-pane';

function App() {
  return (
    <SplitPane direction="horizontal">
      <Pane minSize={100}>
        Sidebar
      </Pane>
      <Pane>
        Main Content
      </Pane>
    </SplitPane>
  );
}`}
                </code>
              </div>
            </div>
          </Pane>
        </SplitPane>
      </div>
    </div>
  );
}
