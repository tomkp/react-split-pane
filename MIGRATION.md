# Migration Guide: v0.1.x to v3.0.0

This guide will help you migrate from react-split-pane v0.1.x to v3.0.0. Version 3 is a complete rewrite with modern React patterns, TypeScript support, and improved accessibility.

## Overview of Changes

v3.0.0 introduces several breaking changes:

- **Component structure**: Children must be wrapped in `<Pane>` components
- **Props renamed**: `split` → `direction`, callback names changed
- **Props moved**: Size constraints moved from `<SplitPane>` to `<Pane>`
- **Terminology**: `vertical`/`horizontal` meanings swapped to match CSS flex direction
- **New features**: Keyboard navigation, ARIA attributes, touch support, snap points
- **Removed**: `primary` prop, `allowResize` per-pane, `Resizer` class names

## Quick Migration

### Before (v0.1.x)

```jsx
import SplitPane from 'react-split-pane';

<SplitPane split="vertical" minSize={50} defaultSize={200}>
  <div>Left</div>
  <div>Right</div>
</SplitPane>
```

### After (v3)

```jsx
import { SplitPane, Pane } from 'react-split-pane';

<SplitPane direction="horizontal">
  <Pane minSize={50} defaultSize={200}>
    <div>Left</div>
  </Pane>
  <Pane>
    <div>Right</div>
  </Pane>
</SplitPane>
```

## Detailed Changes

### 1. Import Changes

```jsx
// v0.1.x
import SplitPane from 'react-split-pane';

// v3
import { SplitPane, Pane } from 'react-split-pane';
```

### 2. Children Must Be Wrapped in `<Pane>`

In v0.1.x, you could use any element as children. In v3, all children must be `<Pane>` components:

```jsx
// v0.1.x
<SplitPane split="vertical">
  <div>Pane 1</div>
  <div>Pane 2</div>
</SplitPane>

// v3
<SplitPane direction="horizontal">
  <Pane>
    <div>Pane 1</div>
  </Pane>
  <Pane>
    <div>Pane 2</div>
  </Pane>
</SplitPane>
```

### 3. Direction Terminology Changed

The meaning of `vertical` and `horizontal` has been **swapped** to align with CSS flexbox terminology:

| v0.1.x | v3 | Layout |
|--------|-----|--------|
| `split="vertical"` | `direction="horizontal"` | Panes side-by-side (left/right) |
| `split="horizontal"` | `direction="vertical"` | Panes stacked (top/bottom) |

In v3, `direction` describes the flex direction:
- `horizontal` = panes arranged horizontally (side-by-side)
- `vertical` = panes arranged vertically (stacked)

```jsx
// v0.1.x - side-by-side panes
<SplitPane split="vertical">

// v3 - side-by-side panes
<SplitPane direction="horizontal">
```

```jsx
// v0.1.x - stacked panes
<SplitPane split="horizontal">

// v3 - stacked panes
<SplitPane direction="vertical">
```

### 4. Size Props Moved to `<Pane>`

Size constraints have moved from `<SplitPane>` to individual `<Pane>` components:

```jsx
// v0.1.x
<SplitPane split="vertical" minSize={50} maxSize={500} defaultSize={200}>
  <div>Pane 1</div>
  <div>Pane 2</div>
</SplitPane>

// v3
<SplitPane direction="horizontal">
  <Pane minSize={50} maxSize={500} defaultSize={200}>
    <div>Pane 1</div>
  </Pane>
  <Pane>
    <div>Pane 2</div>
  </Pane>
</SplitPane>
```

### 5. Size Values Accept Strings

v3 accepts both numbers (pixels) and strings with units:

```jsx
// v0.1.x - numbers only (pixels)
<SplitPane minSize={50} defaultSize={200}>

// v3 - numbers or strings with units
<Pane minSize={50} defaultSize={200}>        // pixels
<Pane minSize="50px" defaultSize="200px">    // explicit pixels
<Pane minSize="10%" defaultSize="25%">       // percentages
```

### 6. Callback Props Renamed

| v0.1.x | v3 | Notes |
|--------|-----|-------|
| `onDragStarted` | `onResizeStart` | Now receives `ResizeEvent` object |
| `onChange` | `onResize` | Receives `(sizes[], event)` |
| `onDragFinished` | `onResizeEnd` | Receives `(sizes[], event)` |

```jsx
// v0.1.x
<SplitPane
  onDragStarted={() => console.log('started')}
  onChange={(size) => console.log(size)}
  onDragFinished={(size) => console.log('finished', size)}
>

// v3
<SplitPane
  onResizeStart={(event) => console.log('started', event.source)}
  onResize={(sizes, event) => console.log(sizes)}
  onResizeEnd={(sizes, event) => console.log('finished', sizes)}
>
```

The `ResizeEvent` object includes:
- `sizes`: Array of pane sizes in pixels
- `source`: `'mouse'` | `'touch'` | `'keyboard'`
- `originalEvent`: The original DOM event

### 7. `primary` Prop Removed

The `primary` prop has been removed. In v3, sizes are distributed proportionally when the container resizes. For controlled sizing, use the `size` prop on each `<Pane>`:

```jsx
// v0.1.x
<SplitPane split="vertical" defaultSize={200} primary="second">

// v3 - use controlled mode with state
function App() {
  const [sizes, setSizes] = useState([null, 200]); // second pane fixed

  return (
    <SplitPane onResize={setSizes}>
      <Pane size={sizes[0]}>Left</Pane>
      <Pane size={sizes[1]}>Right (fixed)</Pane>
    </SplitPane>
  );
}
```

### 8. `allowResize` Renamed to `resizable`

```jsx
// v0.1.x
<SplitPane allowResize={false}>

// v3
<SplitPane resizable={false}>
```

### 9. `step` Prop

The `step` prop now applies to keyboard navigation. Use `snapPoints` for drag snapping:

```jsx
// v0.1.x - step for dragging
<SplitPane step={50}>

// v3 - step for keyboard, snapPoints for dragging
<SplitPane
  step={10}                          // keyboard arrow key step
  snapPoints={[100, 200, 300, 400]}  // drag snap positions
  snapTolerance={20}                 // snap sensitivity
>
```

### 10. Styling Changes

#### CSS Class Names Changed

| v0.1.x | v3 |
|--------|-----|
| `SplitPane` | `split-pane` |
| `Resizer` | `split-pane-divider` |
| `Pane1`, `Pane2` | `split-pane-pane` |

#### Inline Style Props Changed

| v0.1.x | v3 |
|--------|-----|
| `style` | `style` |
| `paneStyle` | Use `<Pane style={}>` |
| `pane1Style` | Use `<Pane style={}>` on first pane |
| `pane2Style` | Use `<Pane style={}>` on second pane |
| `resizerStyle` | `dividerStyle` |

```jsx
// v0.1.x
<SplitPane
  style={{ height: '100vh' }}
  pane1Style={{ background: 'red' }}
  pane2Style={{ background: 'blue' }}
  resizerStyle={{ width: 10 }}
>
  <div>Pane 1</div>
  <div>Pane 2</div>
</SplitPane>

// v3
<SplitPane
  style={{ height: '100vh' }}
  dividerStyle={{ width: 10 }}
>
  <Pane style={{ background: 'red' }}>
    <div>Pane 1</div>
  </Pane>
  <Pane style={{ background: 'blue' }}>
    <div>Pane 2</div>
  </Pane>
</SplitPane>
```

#### Custom Resizer → Custom Divider

```jsx
// v0.1.x - CSS class customization
<SplitPane resizerClassName="my-resizer">

// v3 - custom component or className
<SplitPane dividerClassName="my-divider">

// v3 - fully custom divider component
function CustomDivider(props) {
  return (
    <div {...props} className="my-custom-divider">
      <span className="grip-icon" />
    </div>
  );
}

<SplitPane divider={CustomDivider}>
```

### 11. Persistence Pattern Updated

```jsx
// v0.1.x
<SplitPane
  defaultSize={parseInt(localStorage.getItem('splitPos'), 10) || 200}
  onChange={(size) => localStorage.setItem('splitPos', size)}
>
  <div>Pane 1</div>
  <div>Pane 2</div>
</SplitPane>

// v3 - using the usePersistence hook
import { SplitPane, Pane } from 'react-split-pane';
import { usePersistence } from 'react-split-pane/persistence';

function App() {
  const [sizes, setSizes] = usePersistence({ key: 'splitPos' });

  return (
    <SplitPane onResize={setSizes}>
      <Pane size={sizes[0] || 200}>Pane 1</Pane>
      <Pane>Pane 2</Pane>
    </SplitPane>
  );
}
```

### 12. Multiple Panes

v3 supports 2+ panes natively (no nesting required):

```jsx
// v0.1.x - required nesting for 3+ panes
<SplitPane split="vertical">
  <div>Pane 1</div>
  <SplitPane split="vertical">
    <div>Pane 2</div>
    <div>Pane 3</div>
  </SplitPane>
</SplitPane>

// v3 - native support for multiple panes
<SplitPane direction="horizontal">
  <Pane>Pane 1</Pane>
  <Pane>Pane 2</Pane>
  <Pane>Pane 3</Pane>
</SplitPane>
```

## New Features in v3

### Keyboard Navigation

Dividers are now keyboard accessible:

- **Arrow Keys**: Resize by step (default 10px)
- **Shift + Arrow**: Resize by larger step (50px)
- **Home**: Minimize pane to minimum size
- **End**: Maximize pane to maximum size
- **Tab**: Navigate between dividers

### ARIA Attributes

v3 includes proper ARIA attributes for screen reader support:

- `role="separator"`
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- `aria-orientation`
- `aria-label`

### Touch Support

Touch events work out of the box on mobile devices.

### Snap Points

Add snap points for commonly used sizes:

```jsx
<SplitPane
  snapPoints={[200, 400, 600]}
  snapTolerance={20}
>
```

## TypeScript

v3 is written in TypeScript. Import types directly:

```tsx
import type {
  SplitPaneProps,
  PaneProps,
  DividerProps,
  Direction,
  Size,
  ResizeEvent
} from 'react-split-pane';
```

## Browser Support

v3 drops support for IE11. Use v0.1.x if you need IE11 support.

Supported browsers:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Getting Help

If you encounter issues during migration:

1. Check the [README](./README.md) for current API documentation
2. Open an issue on [GitHub](https://github.com/tomkp/react-split-pane/issues)
