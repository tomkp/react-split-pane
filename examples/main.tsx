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

const examples: { id: Example; label: string; shortLabel: string }[] = [
  { id: 'basic', label: 'Basic', shortLabel: 'Basic' },
  { id: 'nested', label: 'Nested', shortLabel: 'Nest' },
  { id: 'controlled', label: 'Controlled', shortLabel: 'Ctrl' },
  { id: 'styled', label: 'Styled', shortLabel: 'Style' },
  { id: 'snap', label: 'Snap Points', shortLabel: 'Snap' },
  { id: 'touch', label: 'Touch', shortLabel: 'Touch' },
];

function App() {
  const [example, setExample] = useState<Example>('touch');

  return (
    <div className="app">
      <nav className="nav">
        <h1>React Split Pane</h1>
        <div className="nav-buttons">
          {examples.map(({ id, label, shortLabel }) => (
            <button
              key={id}
              className={example === id ? 'active' : ''}
              onClick={() => setExample(id)}
              aria-label={label}
            >
              <span className="label-full">{label}</span>
              <span className="label-short">{shortLabel}</span>
            </button>
          ))}
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
