import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BasicExample } from './BasicExample';
import { NestedExample } from './NestedExample';
import { ControlledExample } from './ControlledExample';
import { StyledExample } from './StyledExample';
import { SnapPointsExample } from './SnapPointsExample';
import { PercentageExample } from './PercentageExample';
import './styles.css';

type Example =
  | 'basic'
  | 'nested'
  | 'controlled'
  | 'styled'
  | 'snap'
  | 'percent';

const examples: { id: Example; label: string; shortLabel: string }[] = [
  { id: 'basic', label: 'Basic', shortLabel: 'Basic' },
  { id: 'nested', label: 'Nested', shortLabel: 'Nest' },
  { id: 'controlled', label: 'Controlled', shortLabel: 'Ctrl' },
  { id: 'styled', label: 'Styled', shortLabel: 'Style' },
  { id: 'snap', label: 'Snap Points', shortLabel: 'Snap' },
  { id: 'percent', label: 'Percentage', shortLabel: '%' },
];

function App() {
  const [example, setExample] = useState<Example>('basic');

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
        {example === 'percent' && <PercentageExample />}
      </main>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
