import React, { useState, useEffect } from 'react';
import { SplitPane, Pane } from '../src';

export function BasicExample() {
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>(
    'horizontal'
  );

  // Default to vertical on mobile for better usability
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      setDirection('vertical');
    }
  }, []);

  return (
    <div className="example-container">
      <div className="example-info">
        <h2>Basic Split Pane</h2>
        <p>
          A simple two-pane layout.{' '}
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
              minHeight: '32px',
            }}
          >
            {direction}
          </button>
        </p>
      </div>
      <div className="example-content">
        <SplitPane direction={direction}>
          <Pane
            minSize={80}
            defaultSize={direction === 'vertical' ? '40%' : '30%'}
          >
            <div className="pane-content sidebar">
              <h2>Sidebar</h2>
              <p>Min size: 80px. Drag the divider to resize.</p>
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
          <Pane minSize={100}>
            <div className="pane-content editor">
              <h2>Main Content</h2>
              <p>Use arrow keys when focused for keyboard control.</p>
              <div className="code-block">
                <code>
                  {`import { SplitPane, Pane } from 'react-split-pane';

<SplitPane direction="${direction}">
  <Pane minSize={80}>
    Sidebar
  </Pane>
  <Pane>
    Main Content
  </Pane>
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
