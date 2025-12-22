import React, { useState } from 'react';
import { SplitPane, Pane } from '../src';

export function TouchExample() {
  const [resizeSource, setResizeSource] = useState<string | null>(null);
  const [sizes, setSizes] = useState<number[]>([]);

  return (
    <div className="example-container">
      <div className="example-info">
        <h2>Touch Support</h2>
        <p>
          Full touch support for mobile and tablet devices. Try dragging the
          divider with your finger on a touch device.
        </p>
        {resizeSource && (
          <p className="size-display">
            Last resize via:{' '}
            <strong className={`source-${resizeSource}`}>{resizeSource}</strong>
            {sizes.length > 0 && (
              <span>
                {' '}
                | Sizes: {sizes.map((s) => Math.round(s)).join(' / ')}px
              </span>
            )}
          </p>
        )}
      </div>
      <div className="example-content touch-example">
        <SplitPane
          direction="horizontal"
          onResizeStart={(event) => setResizeSource(event.source)}
          onResize={(newSizes) => setSizes(newSizes)}
        >
          <Pane minSize={80} defaultSize="40%">
            <div className="pane-content touch-pane">
              <h2>Touch Here</h2>
              <div className="touch-instructions">
                <div className="touch-icon">
                  <span role="img" aria-label="touch">
                    👆
                  </span>
                </div>
                <p>Drag the divider with your finger</p>
                <ul>
                  <li>Works on iOS Safari</li>
                  <li>Works on Chrome Android</li>
                  <li>Works on tablets</li>
                </ul>
              </div>
            </div>
          </Pane>
          <Pane minSize={80}>
            <div className="pane-content touch-pane">
              <h2>Resize Methods</h2>
              <div className="resize-methods">
                <div className="method">
                  <span className="method-icon">🖱️</span>
                  <span className="method-name">Mouse</span>
                  <span className="method-desc">Click and drag</span>
                </div>
                <div className="method">
                  <span className="method-icon">👆</span>
                  <span className="method-name">Touch</span>
                  <span className="method-desc">Tap and drag</span>
                </div>
                <div className="method">
                  <span className="method-icon">⌨️</span>
                  <span className="method-name">Keyboard</span>
                  <span className="method-desc">Arrow keys when focused</span>
                </div>
              </div>
              <div className="code-block">
                <code>
                  {`// Touch events are handled automatically
<SplitPane
  onResizeStart={(event) => {
    // event.source: 'mouse' | 'touch' | 'keyboard'
    console.log('Resize via:', event.source);
  }}
  onResize={(sizes, event) => {
    console.log('New sizes:', sizes);
  }}
>
  <Pane>...</Pane>
  <Pane>...</Pane>
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
