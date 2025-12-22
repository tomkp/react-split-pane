import React, { useState } from 'react';
import { SplitPane, Pane } from '../src';

export function SnapPointsExample() {
  const [currentSize, setCurrentSize] = useState<number | null>(null);
  const snapPoints = [150, 300, 450];

  return (
    <div className="example-container">
      <div className="example-info">
        <h2>Snap Points</h2>
        <p>
          Panes snap to predefined positions when dragging. Snap points:{' '}
          {snapPoints.map((p, i) => (
            <span key={p} className="snap-indicator">
              {p}px{i < snapPoints.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
        {currentSize !== null && (
          <p className="size-display">
            Current size: <strong>{Math.round(currentSize)}px</strong>
            {snapPoints.includes(Math.round(currentSize)) && (
              <span className="snapped-badge">Snapped!</span>
            )}
          </p>
        )}
      </div>
      <div className="example-content">
        <SplitPane
          direction="horizontal"
          snapPoints={snapPoints}
          snapTolerance={20}
          onResize={(sizes) => setCurrentSize(sizes[0] ?? null)}
        >
          <Pane minSize={100} defaultSize={300}>
            <div className="pane-content sidebar">
              <h2>Sidebar</h2>
              <p>Drag the divider and feel it snap to:</p>
              <ul className="snap-list">
                {snapPoints.map((point) => (
                  <li
                    key={point}
                    className={
                      currentSize !== null && Math.abs(currentSize - point) < 5
                        ? 'active'
                        : ''
                    }
                  >
                    {point}px
                  </li>
                ))}
              </ul>
              <p className="tip">
                Tip: When within 20px of a snap point, the pane will snap to
                that position.
              </p>
            </div>
          </Pane>
          <Pane minSize={200}>
            <div className="pane-content editor">
              <h2>Main Content</h2>
              <p>
                Snap points are useful for creating consistent layouts where
                panes should align to specific widths.
              </p>
              <div className="code-block">
                <code>
                  {`import { SplitPane, Pane } from 'react-split-pane';

function App() {
  return (
    <SplitPane
      direction="horizontal"
      snapPoints={[150, 300, 450]}
      snapTolerance={20}
    >
      <Pane minSize={100} defaultSize={300}>
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
