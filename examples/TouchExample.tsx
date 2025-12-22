import React, { useState, useEffect } from 'react';
import { SplitPane, Pane } from '../src';

export function TouchExample() {
  const [resizeSource, setResizeSource] = useState<string | null>(null);
  const [sizes, setSizes] = useState<number[]>([]);
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');

  // Use vertical layout on mobile for better touch experience
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      setDirection('vertical');
    }
  }, []);

  return (
    <div className="example-container">
      <div className="example-info">
        <h2>Touch Support</h2>
        <p>
          Full touch support for mobile. Drag the divider with your finger!
        </p>
        {resizeSource && (
          <p className="size-display">
            Via: <strong className={`source-${resizeSource}`}>{resizeSource}</strong>
            {sizes.length > 0 && (
              <span> | {sizes.map((s) => Math.round(s)).join('/')}px</span>
            )}
          </p>
        )}
      </div>
      <div className="example-content touch-example">
        <SplitPane
          direction={direction}
          onResizeStart={(event) => setResizeSource(event.source)}
          onResize={(newSizes) => setSizes(newSizes)}
        >
          <Pane minSize={60} defaultSize="40%">
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
          <Pane minSize={60}>
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
                  {`// Touch events handled automatically
<SplitPane
  onResizeStart={(e) => {
    // e.source: 'mouse' | 'touch' | 'keyboard'
  }}
  onResize={(sizes) => {
    console.log('Sizes:', sizes);
  }}
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
