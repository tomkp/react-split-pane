# React Split Pane v3

Modern, accessible, TypeScript-first split pane component for React.

[![NPM version](https://img.shields.io/npm/v/react-split-pane.svg?style=flat)](https://www.npmjs.com/package/react-split-pane)
![NPM license](https://img.shields.io/npm/l/react-split-pane.svg?style=flat)
[![NPM downloads](https://img.shields.io/npm/dm/react-split-pane.svg?style=flat)](https://www.npmjs.com/package/react-split-pane)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/react-split-pane)](https://bundlephobia.com/package/react-split-pane)

**[Live Examples](https://tomkp.github.io/react-split-pane)**

## ✨ Features

- 🪝 **Hooks-based** - Built with modern React patterns
- 📘 **TypeScript** - Full type safety out of the box
- ♿ **Accessible** - Keyboard navigation, ARIA attributes, screen reader support
- 📱 **Touch-friendly** - Full mobile/tablet support
- 🎯 **Flexible** - Controlled/uncontrolled modes, nested layouts, 2+ panes
- 🪶 **Lightweight** - < 5KB gzipped
- ⚡ **Performant** - RAF-throttled resize, optimized renders
- 🎨 **Customizable** - Full styling control

## Installation

```bash
npm install react-split-pane@next

# or
yarn add react-split-pane@next

# or
pnpm add react-split-pane@next
```

## Quick Start

```tsx
import { SplitPane, Pane } from 'react-split-pane';

function App() {
  return (
    <SplitPane direction="horizontal">
      <Pane minSize="200px" defaultSize="300px">
        <Sidebar />
      </Pane>
      <Pane>
        <MainContent />
      </Pane>
    </SplitPane>
  );
}
```

## Basic Usage

### Horizontal Split (Side-by-Side)

```tsx
<SplitPane direction="horizontal">
  <Pane defaultSize="25%">
    <LeftPanel />
  </Pane>
  <Pane>
    <RightPanel />
  </Pane>
</SplitPane>
```

### Vertical Split (Top-Bottom)

```tsx
<SplitPane direction="vertical">
  <Pane defaultSize="100px">
    <Header />
  </Pane>
  <Pane>
    <Content />
  </Pane>
</SplitPane>
```

### Controlled Mode

```tsx
function App() {
  const [sizes, setSizes] = useState([300, 500]);

  return (
    <SplitPane onResize={setSizes}>
      <Pane size={sizes[0]} minSize="200px">
        <Sidebar />
      </Pane>
      <Pane size={sizes[1]}>
        <Main />
      </Pane>
    </SplitPane>
  );
}
```

### Nested Layouts

```tsx
<SplitPane direction="vertical">
  <Pane defaultSize="60px">
    <Header />
  </Pane>

  <SplitPane direction="horizontal">
    <Pane defaultSize="250px" minSize="150px">
      <Sidebar />
    </Pane>

    <SplitPane direction="vertical">
      <Pane>
        <Editor />
      </Pane>
      <Pane defaultSize="200px">
        <Console />
      </Pane>
    </SplitPane>
  </SplitPane>
</SplitPane>
```

## Advanced Features

### Persistence

The `usePersistence` hook saves and restores pane sizes to localStorage (or sessionStorage):

```tsx
import { usePersistence } from 'react-split-pane/persistence';

function App() {
  const [sizes, setSizes] = usePersistence({ key: 'my-layout' });

  return (
    <SplitPane onResize={setSizes}>
      <Pane size={sizes[0] || 300}>
        <Sidebar />
      </Pane>
      <Pane size={sizes[1]}>
        <Main />
      </Pane>
    </SplitPane>
  );
}
```

#### usePersistence Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `key` | `string` | Required | Storage key for persisting sizes |
| `storage` | `Storage` | `localStorage` | Storage backend (localStorage or sessionStorage) |
| `debounce` | `number` | `300` | Debounce delay in ms before saving |

```tsx
// Use sessionStorage instead of localStorage
const [sizes, setSizes] = usePersistence({
  key: 'my-layout',
  storage: sessionStorage,
  debounce: 500,
});
```

### Snap Points

```tsx
<SplitPane
  snapPoints={[200, 400, 600]}
  snapTolerance={20}
>
  {/* panes */}
</SplitPane>
```

### Custom Divider

```tsx
function CustomDivider(props) {
  return (
    <div {...props} style={{ ...props.style, background: 'blue' }}>
      <GripIcon />
    </div>
  );
}

<SplitPane divider={CustomDivider}>
  {/* panes */}
</SplitPane>
```

## Keyboard Navigation

The divider is fully keyboard accessible:

- **Arrow Keys**: Resize by `step` pixels (default: 10px)
- **Shift + Arrow**: Resize by larger step (default: 50px)
- **Home**: Minimize left/top pane
- **End**: Maximize left/top pane
- **Tab**: Navigate between dividers

## API Reference

### SplitPane Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| `resizable` | `boolean` | `true` | Whether panes can be resized |
| `snapPoints` | `number[]` | `[]` | Snap points in pixels |
| `snapTolerance` | `number` | `10` | Snap tolerance in pixels |
| `step` | `number` | `10` | Keyboard resize step |
| `onResizeStart` | `(event) => void` | - | Called when resize starts |
| `onResize` | `(sizes, event) => void` | - | Called during resize |
| `onResizeEnd` | `(sizes, event) => void` | - | Called when resize ends |
| `className` | `string` | - | CSS class name |
| `style` | `CSSProperties` | - | Inline styles |
| `divider` | `ComponentType` | - | Custom divider component |
| `dividerClassName` | `string` | - | Divider class name |
| `dividerStyle` | `CSSProperties` | - | Divider inline styles |

### Pane Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultSize` | `string \| number` | `'50%'` | Initial size (uncontrolled) |
| `size` | `string \| number` | - | Controlled size |
| `minSize` | `string \| number` | `0` | Minimum size |
| `maxSize` | `string \| number` | `Infinity` | Maximum size |
| `className` | `string` | - | CSS class name |
| `style` | `CSSProperties` | - | Inline styles |

## Styling

### Default Stylesheet

Import the optional default styles with CSS custom properties:

```tsx
import 'react-split-pane/styles.css';
```

Customize via CSS variables:

```css
.my-split-pane {
  --split-pane-divider-size: 8px;
  --split-pane-divider-color: #e0e0e0;
  --split-pane-divider-color-hover: #b0b0b0;
  --split-pane-focus-color: #2196f3;
}
```

The default styles include dark mode support via `prefers-color-scheme`.

### Basic Styles

```css
.split-pane {
  height: 100vh;
}

.split-pane-divider {
  background: #e0e0e0;
  transition: background 0.2s;
}

.split-pane-divider:hover {
  background: #b0b0b0;
}

.split-pane-divider:focus {
  outline: 2px solid #2196f3;
  outline-offset: -2px;
}
```

### Expanded Hover Area

This classic pattern creates a thin visible divider with a larger grabbable area that reveals on hover:

```css
.split-pane-divider {
  background: #000;
  opacity: 0.2;
  z-index: 1;
  box-sizing: border-box;
  background-clip: padding-box;
}

.split-pane-divider:hover {
  transition: all 0.2s ease;
}

.split-pane-divider.horizontal {
  width: 11px;
  margin: 0 -5px;
  border-left: 5px solid rgba(255, 255, 255, 0);
  border-right: 5px solid rgba(255, 255, 255, 0);
  cursor: col-resize;
}

.split-pane-divider.horizontal:hover {
  border-left: 5px solid rgba(0, 0, 0, 0.5);
  border-right: 5px solid rgba(0, 0, 0, 0.5);
}

.split-pane-divider.vertical {
  height: 11px;
  margin: -5px 0;
  border-top: 5px solid rgba(255, 255, 255, 0);
  border-bottom: 5px solid rgba(255, 255, 255, 0);
  cursor: row-resize;
}

.split-pane-divider.vertical:hover {
  border-top: 5px solid rgba(0, 0, 0, 0.5);
  border-bottom: 5px solid rgba(0, 0, 0, 0.5);
}
```

### Minimal Divider

A subtle single-pixel divider:

```css
.split-pane-divider.horizontal {
  width: 1px;
  margin: 0;
  background: linear-gradient(to right, transparent, #ccc, transparent);
}

.split-pane-divider.vertical {
  height: 1px;
  margin: 0;
  background: linear-gradient(to bottom, transparent, #ccc, transparent);
}
```

## Tailwind CSS & shadcn/ui

React Split Pane works seamlessly with Tailwind CSS and shadcn/ui. The component uses plain CSS and inline styles (no CSS-in-JS), so there are no conflicts with utility-first frameworks.

### Using Tailwind Classes

Apply Tailwind classes directly via `className` props. Skip importing the default stylesheet for full Tailwind control:

```tsx
import { SplitPane, Pane } from 'react-split-pane';
// Don't import 'react-split-pane/styles.css' if using Tailwind

<SplitPane
  className="h-screen w-full"
  dividerClassName="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
>
  <Pane defaultSize="300px" className="bg-white dark:bg-gray-900 p-4">
    <Sidebar />
  </Pane>
  <Pane className="bg-gray-50 dark:bg-gray-800 p-4">
    <MainContent />
  </Pane>
</SplitPane>
```

### shadcn/ui Integration

Use shadcn's CSS variables and utilities for consistent theming:

```tsx
import { SplitPane, Pane } from 'react-split-pane';

<SplitPane
  className="h-full w-full"
  dividerClassName="bg-border hover:bg-accent transition-colors"
>
  <Pane defaultSize="280px" className="bg-background border-r">
    <Sidebar />
  </Pane>
  <Pane className="bg-muted/50">
    <MainContent />
  </Pane>
</SplitPane>
```

### Custom Divider with shadcn

Create a themed divider component using shadcn's `cn` utility:

```tsx
import { cn } from '@/lib/utils';
import type { DividerProps } from 'react-split-pane';

function ThemedDivider({ direction, isDragging, disabled, ...props }: DividerProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center transition-colors',
        'bg-border hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring',
        direction === 'horizontal'
          ? 'w-1 cursor-col-resize'
          : 'h-1 cursor-row-resize',
        isDragging && 'bg-primary',
        disabled && 'cursor-not-allowed opacity-50'
      )}
      {...props}
    />
  );
}

<SplitPane divider={ThemedDivider}>
  <Pane>Left</Pane>
  <Pane>Right</Pane>
</SplitPane>
```

### CSS Variables with Tailwind

Override the default CSS variables in your `globals.css` to match your Tailwind theme:

```css
/* globals.css */
@layer base {
  :root {
    --split-pane-divider-size: 4px;
    --split-pane-divider-color: theme('colors.gray.200');
    --split-pane-divider-color-hover: theme('colors.gray.300');
    --split-pane-focus-color: theme('colors.blue.500');
  }

  .dark {
    --split-pane-divider-color: theme('colors.gray.700');
    --split-pane-divider-color-hover: theme('colors.gray.600');
  }
}
```

Or with shadcn/ui CSS variables:

```css
@layer base {
  :root {
    --split-pane-divider-color: hsl(var(--border));
    --split-pane-divider-color-hover: hsl(var(--accent));
    --split-pane-focus-color: hsl(var(--ring));
  }
}
```

## Migration from v0.1.x

See [MIGRATION.md](./MIGRATION.md) for detailed migration guide.

**Quick changes:**

```tsx
// v0.1.x
<SplitPane split="vertical" minSize={50} defaultSize={100}>
  <div>Pane 1</div>
  <div>Pane 2</div>
</SplitPane>

// v3
<SplitPane direction="horizontal">
  <Pane minSize="50px" defaultSize="100px">
    <div>Pane 1</div>
  </Pane>
  <Pane>
    <div>Pane 2</div>
  </Pane>
</SplitPane>
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

**Note:** IE11 is not supported. Use v0.1.x for IE11 compatibility.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT © [tomkp](https://github.com/tomkp)
