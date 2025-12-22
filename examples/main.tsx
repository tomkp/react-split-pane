import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BasicExample } from './BasicExample';
import { NestedExample } from './NestedExample';
import { ControlledExample } from './ControlledExample';
import { StyledExample } from './StyledExample';
import { SnapPointsExample } from './SnapPointsExample';
import { TouchExample } from './TouchExample';
import './styles.css';

type Example = 'basic' | 'nested' | 'controlled' | 'styled' | 'snap' | 'touch';

function App() {
  const [example, setExample] = useState<Example>('basic');

  return (
    <div className="app">
      <nav className="nav">
        <h1>React Split Pane</h1>
        <div className="nav-buttons">
          <button
            className={example === 'basic' ? 'active' : ''}
            onClick={() => setExample('basic')}
          >
            Basic
          </button>
          <button
            className={example === 'nested' ? 'active' : ''}
            onClick={() => setExample('nested')}
          >
            Nested
          </button>
          <button
            className={example === 'controlled' ? 'active' : ''}
            onClick={() => setExample('controlled')}
          >
            Controlled
          </button>
          <button
            className={example === 'styled' ? 'active' : ''}
            onClick={() => setExample('styled')}
          >
            Styled
          </button>
          <button
            className={example === 'snap' ? 'active' : ''}
            onClick={() => setExample('snap')}
          >
            Snap Points
          </button>
          <button
            className={example === 'touch' ? 'active' : ''}
            onClick={() => setExample('touch')}
          >
            Touch
          </button>
        </div>
      </nav>

      <main className="main">
        {example === 'basic' && <BasicExample />}
        {example === 'nested' && <NestedExample />}
        {example === 'controlled' && <ControlledExample />}
        {example === 'styled' && <StyledExample />}
        {example === 'snap' && <SnapPointsExample />}
        {example === 'touch' && <TouchExample />}
      </main>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
