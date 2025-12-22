import React, { useState, useEffect } from 'react';
import { SplitPane, Pane } from '../src';

const STORAGE_KEY = 'split-pane-sizes';

export function ControlledExample() {
  const [sizes, setSizes] = useState<number[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [300, 500];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sizes));
  }, [sizes]);

  const handleResize = (newSizes: number[]) => {
    setSizes(newSizes);
  };

  const handleReset = () => {
    setSizes([300, 500]);
  };

  return (
    <div className="example-container">
      <div className="example-info">
        <h2>Controlled + Persistent</h2>
        <p>
          Sizes are controlled via state and persisted to localStorage. Refresh
          to see persistence.
          <button
            onClick={handleReset}
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
            Reset
          </button>
        </p>
      </div>
      <div className="example-content">
        <SplitPane direction="horizontal" onResize={handleResize}>
          <Pane size={sizes[0]} minSize={150}>
            <div className="pane-content sidebar">
              <h2>Panel A</h2>
              <p>This pane's size is controlled.</p>
              <div className="size-display">
                Width: {Math.round(sizes[0])}px
              </div>
              <div className="code-block" style={{ marginTop: '1rem' }}>
                <code>
                  {`const [sizes, setSizes] = useState([300, 500]);

<SplitPane onResize={setSizes}>
  <Pane size={sizes[0]}>
    Panel A
  </Pane>
  <Pane size={sizes[1]}>
    Panel B
  </Pane>
</SplitPane>`}
                </code>
              </div>
            </div>
          </Pane>
          <Pane size={sizes[1]} minSize={200}>
            <div className="pane-content editor">
              <h2>Panel B</h2>
              <p>Sizes are saved to localStorage on every change.</p>
              <div className="size-display">
                Width: {Math.round(sizes[1])}px
              </div>
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: '#16213e',
                  borderRadius: '4px',
                }}
              >
                <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  localStorage
                </h3>
                <code style={{ fontSize: '0.8rem', color: '#8be9fd' }}>
                  {STORAGE_KEY}: {JSON.stringify(sizes.map(Math.round))}
                </code>
              </div>
            </div>
          </Pane>
        </SplitPane>
      </div>
    </div>
  );
}
