import React, { useState } from 'react';
import { SplitPane, Pane } from '../src';

export function SnapPointsExample() {
  const [currentSize, setCurrentSize] = useState<number | null>(null);
  const snapPoints = [150, 300, 450, 600, 800];

  return (
    <div className="example-container">
      <div className="example-header">
        <h2>Snap Points</h2>
        <p>Panes snap to predefined positions: {snapPoints.join(', ')}px</p>
      </div>
      <div className="example-content">
        <SplitPane
          direction="horizontal"
          snapPoints={snapPoints}
          snapTolerance={20}
          onResize={(sizes) => setCurrentSize(sizes[0] ?? null)}
        >
          <Pane minSize={100} defaultSize={300}>
            <div className="pane gray">
              <h3>Left Pane</h3>
              {currentSize !== null && (
                <p className="size-display">{Math.round(currentSize)}px</p>
              )}
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
            </div>
          </Pane>
          <Pane minSize={200}>
            <div className="pane">
              <h3>Right Pane</h3>
              <div className="code">
                <code>
                  {`<SplitPane
  snapPoints={[150, 300, 450, 600, 800]}
  snapTolerance={20}
>
  ...
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
