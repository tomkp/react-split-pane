# React Split Pane v3

Modern, accessible, TypeScript-first split pane component for React.

[![NPM version](https://img.shields.io/npm/v/react-split-pane.svg?style=flat)](https://www.npmjs.com/package/react-split-pane)
![NPM license](https://img.shields.io/npm/l/react-split-pane.svg?style=flat)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/react-split-pane)](https://bundlephobia.com/package/react-split-pane)

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

Save pane sizes to localStorage:

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

### Custom Divider Styles

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

Contributions are welcome! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md).

## License

MIT © [tomkp](https://github.com/tomkp)
