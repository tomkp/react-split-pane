# React Split Pane v3 Proposal

**Status:** Draft Proposal
**Target Release:** Q2 2026
**Breaking Changes:** Yes (Major Version)

## Executive Summary

This proposal outlines a complete modernization of `react-split-pane` as version 3.0. Given that v2 was never completed and the library hasn't been updated since 2020, v3 represents a fresh start with modern React patterns, improved accessibility, better TypeScript support, and a focus on developer experience.

---

## Why v3 Instead of v2?

1. **v2 Never Materialized**: The v2 mentioned in README (PR #240) was never completed
2. **5+ Years of React Evolution**: React 16 → 18 brought hooks, concurrent features, and new patterns
3. **Accumulated Technical Debt**: 175 security vulnerabilities and outdated dependencies
4. **Clean Slate Needed**: Breaking changes required justify a major version bump
5. **Modern Expectations**: Developers expect hooks, TypeScript-first, and excellent a11y

---

## Core Principles

### 1. Modern React (Hooks-First)
- Functional components with hooks
- No class components
- No deprecated lifecycle methods
- Support React 17-18 concurrent features

### 2. TypeScript-First
- Written in TypeScript
- Auto-generated type definitions
- Full type safety for consumers
- Better IDE support

### 3. Accessibility by Default
- Keyboard navigation built-in
- Proper ARIA attributes
- Screen reader support
- Focus management

### 4. Performance
- Zero unnecessary re-renders
- Optimized drag performance
- Tree-shakeable exports
- Minimal bundle size (<5KB gzipped)

### 5. Developer Experience
- Intuitive API
- Comprehensive documentation
- Interactive examples
- Clear error messages

---

## Breaking Changes

### API Changes

#### 1. Component API Simplification

**Current (v0.1.x):**
```jsx
<SplitPane
  split="vertical"
  minSize={50}
  defaultSize={100}
  primary="first"
  pane1Style={{}}
  pane2Style={{}}
>
  <div>Pane 1</div>
  <div>Pane 2</div>
</SplitPane>
```

**Proposed (v3):**
```jsx
<SplitPane direction="horizontal" onResize={handleResize}>
  <Pane minSize="100px" defaultSize="25%">
    <div>Pane 1</div>
  </Pane>
  <Pane minSize="200px">
    <div>Pane 2</div>
  </Pane>
</SplitPane>
```

**Rationale:**
- More intuitive: each pane controls its own constraints
- Better TypeScript support
- Easier to add 3+ panes in future
- Clearer hierarchy

#### 2. Prop Renames

| Old Prop | New Prop | Reason |
|----------|----------|--------|
| `split="vertical"` | `direction="horizontal"` | Less confusing (vertical split = horizontal layout) |
| `primary="first"` | _Removed_ | Auto-determined by pane constraints |
| `allowResize` | `resizable` | More conventional naming |
| `pane1Style` | _Removed_ | Use `<Pane style={}>` instead |
| `paneClassName` | _Removed_ | Use `<Pane className="">` instead |
| `resizerClassName` | `dividerClassName` | More descriptive |

#### 3. Event Handler Changes

**Current:**
```jsx
onDragStarted={() => {}}
onDragFinished={(size) => {}}
onChange={(size) => {}}
```

**Proposed:**
```jsx
onResizeStart={(event) => {}}
onResize={(sizes: number[]) => {}}
onResizeEnd={(sizes: number[]) => {}}
```

**Changes:**
- Consistent naming convention
- `sizes` array for all panes (future-proofs for 3+ panes)
- Event object passed to all handlers
- Can call `event.preventDefault()` to cancel

### Removed Features

1. **`react-lifecycles-compat`**: No longer needed
2. **IE Support**: Drop IE 11 support (focus on modern browsers)
3. **String Sizes in State**: Internally use numbers only (strings converted at render)
4. **Callback Refs**: Use `React.createRef()` / `useRef()`

### New Features

1. **Keyboard Navigation**: Arrow keys to resize
2. **Touch Improvements**: Better mobile gesture support
3. **Persist State**: Built-in localStorage/sessionStorage support
4. **Multiple Panes**: Support for 3+ panes (not just 2)
5. **Snap Points**: Snap to predefined sizes
6. **Collapse/Expand**: Built-in collapse functionality
7. **Controlled Mode**: Full control over pane sizes
8. **Uncontrolled Mode**: Let component manage state

---

## Technical Architecture

### Technology Stack

```json
{
  "language": "TypeScript 5.x",
  "react": "^18.0.0",
  "build": "Rollup 4.x",
  "test": "Vitest + React Testing Library",
  "docs": "Storybook 8.x",
  "lint": "ESLint 9.x + Biome"
}
```

### Project Structure

```
src/
├── components/
│   ├── SplitPane.tsx           # Main container
│   ├── Pane.tsx                # Individual pane
│   ├── Divider.tsx             # Resizer/divider
│   └── index.ts                # Exports
├── hooks/
│   ├── useResizer.ts           # Drag logic
│   ├── usePaneSize.ts          # Size calculations
│   ├── useKeyboardResize.ts    # Keyboard support
│   └── usePersistence.ts       # LocalStorage integration
├── utils/
│   ├── calculations.ts         # Size math
│   ├── constraints.ts          # Min/max logic
│   └── accessibility.ts        # A11y helpers
├── types/
│   └── index.ts                # Type definitions
└── index.ts                    # Main entry
```

### Core Hooks

#### `useResizer`
```typescript
function useResizer(options: ResizerOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [sizes, setSizes] = useState<number[]>([]);

  const handleDragStart = useCallback((e: MouseEvent | TouchEvent) => {
    // Drag logic
  }, []);

  const handleDrag = useCallback((e: MouseEvent | TouchEvent) => {
    // Use RAF for performance
    requestAnimationFrame(() => {
      // Update sizes
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    // Cleanup
  }, []);

  return { sizes, isDragging, handlers };
}
```

#### `useKeyboardResize`
```typescript
function useKeyboardResize(options: KeyboardOptions) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      // Resize with keyboard
      e.preventDefault();
    }
  }, []);

  return { handleKeyDown };
}
```

---

## Implementation Plan

### Phase 1: Foundation (Weeks 1-2)

- [ ] Set up TypeScript project structure
- [ ] Configure build system (Rollup 4.x)
- [ ] Set up Vitest + React Testing Library
- [ ] Create base components (SplitPane, Pane, Divider)
- [ ] Implement basic horizontal split

### Phase 2: Core Functionality (Weeks 3-4)

- [ ] Mouse drag resize
- [ ] Touch gesture resize
- [ ] Size constraints (min/max)
- [ ] Percentage vs pixel sizes
- [ ] Vertical split support
- [ ] `useResizer` hook
- [ ] `usePaneSize` hook

### Phase 3: Advanced Features (Weeks 5-6)

- [ ] Keyboard navigation
- [ ] Snap points
- [ ] Collapse/expand
- [ ] Persistence (localStorage)
- [ ] Controlled/uncontrolled modes
- [ ] Step-based resizing

### Phase 4: Polish (Weeks 7-8)

- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Error boundaries
- [ ] DevTools warnings

### Phase 5: Documentation (Weeks 9-10)

- [ ] API documentation
- [ ] Migration guide (v0.1 → v3)
- [ ] Storybook examples
- [ ] CodeSandbox templates
- [ ] Video tutorials
- [ ] Blog post

### Phase 6: Release (Weeks 11-12)

- [ ] Beta release (3.0.0-beta.1)
- [ ] Community feedback
- [ ] Bug fixes
- [ ] Final release (3.0.0)
- [ ] npm publish
- [ ] GitHub release notes

---

## API Design

### SplitPane Component

```typescript
interface SplitPaneProps {
  /** Layout direction */
  direction?: 'horizontal' | 'vertical';

  /** Whether panes can be resized */
  resizable?: boolean;

  /** Snap points for auto-alignment */
  snapPoints?: number[];

  /** Step size for keyboard resize */
  step?: number;

  /** Called when resize starts */
  onResizeStart?: (event: ResizeEvent) => void;

  /** Called during resize (consider debouncing) */
  onResize?: (sizes: number[], event: ResizeEvent) => void;

  /** Called when resize ends */
  onResizeEnd?: (sizes: number[], event: ResizeEvent) => void;

  /** CSS class name */
  className?: string;

  /** Inline styles */
  style?: React.CSSProperties;

  /** Custom divider component */
  divider?: React.ComponentType<DividerProps>;

  /** Custom divider styles */
  dividerStyle?: React.CSSProperties;

  /** Custom divider class name */
  dividerClassName?: string;

  /** Pane children (must be Pane components or elements) */
  children: React.ReactNode;
}

// Usage
<SplitPane
  direction="horizontal"
  onResize={handleResize}
  snapPoints={[25, 50, 75]}
>
  {/* children */}
</SplitPane>
```

### Pane Component

```typescript
interface PaneProps {
  /** Initial size (uncontrolled) */
  defaultSize?: string | number;

  /** Controlled size */
  size?: string | number;

  /** Minimum size */
  minSize?: string | number;

  /** Maximum size */
  maxSize?: string | number;

  /** Whether this pane can collapse */
  collapsible?: boolean;

  /** Whether pane is collapsed */
  collapsed?: boolean;

  /** Called when collapse state changes */
  onCollapse?: (collapsed: boolean) => void;

  /** CSS class name */
  className?: string;

  /** Inline styles */
  style?: React.CSSProperties;

  /** Pane content */
  children: React.ReactNode;
}

// Usage
<Pane
  defaultSize="300px"
  minSize="200px"
  maxSize="50%"
  collapsible
>
  <Sidebar />
</Pane>
```

### Divider Component

```typescript
interface DividerProps {
  /** Layout direction */
  direction: 'horizontal' | 'vertical';

  /** Whether divider is being dragged */
  isDragging: boolean;

  /** Whether divider can be interacted with */
  disabled: boolean;

  /** Mouse down handler */
  onMouseDown: (e: React.MouseEvent) => void;

  /** Touch start handler */
  onTouchStart: (e: React.TouchEvent) => void;

  /** Keyboard handler */
  onKeyDown: (e: React.KeyboardEvent) => void;

  /** CSS class name */
  className?: string;

  /** Inline styles */
  style?: React.CSSProperties;

  /** Custom content */
  children?: React.ReactNode;
}

// Custom divider example
function CustomDivider(props: DividerProps) {
  return (
    <div {...props} className={`custom-divider ${props.className}`}>
      <GripIcon />
    </div>
  );
}

<SplitPane divider={CustomDivider}>
  {/* panes */}
</SplitPane>
```

---

## Examples

### Basic Usage

```tsx
import { SplitPane, Pane } from 'react-split-pane';

function App() {
  return (
    <SplitPane direction="horizontal">
      <Pane defaultSize="300px" minSize="200px">
        <Sidebar />
      </Pane>
      <Pane>
        <MainContent />
      </Pane>
    </SplitPane>
  );
}
```

### Controlled Mode

```tsx
function App() {
  const [sizes, setSizes] = useState([300, 500]);

  return (
    <SplitPane
      direction="horizontal"
      onResize={setSizes}
    >
      <Pane size={sizes[0]} minSize="200px">
        <Sidebar />
      </Pane>
      <Pane size={sizes[1]}>
        <MainContent />
      </Pane>
    </SplitPane>
  );
}
```

### Persistence

```tsx
function App() {
  const [sizes, setSizes] = usePersistentState('my-layout', [300, 500]);

  return (
    <SplitPane onResize={setSizes}>
      <Pane size={sizes[0]}>
        <Sidebar />
      </Pane>
      <Pane size={sizes[1]}>
        <MainContent />
      </Pane>
    </SplitPane>
  );
}

// Or built-in:
function App() {
  return (
    <SplitPane
      persist="my-layout"
      storage="localStorage"
    >
      <Pane defaultSize="300px">
        <Sidebar />
      </Pane>
      <Pane>
        <MainContent />
      </Pane>
    </SplitPane>
  );
}
```

### Nested Layouts

```tsx
function App() {
  return (
    <SplitPane direction="vertical">
      <Pane defaultSize="100px">
        <Header />
      </Pane>

      <SplitPane direction="horizontal">
        <Pane defaultSize="300px" collapsible>
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
  );
}
```

### Three Panes

```tsx
function App() {
  return (
    <SplitPane direction="horizontal">
      <Pane defaultSize="25%">
        <LeftSidebar />
      </Pane>
      <Pane>
        <MainContent />
      </Pane>
      <Pane defaultSize="300px">
        <RightSidebar />
      </Pane>
    </SplitPane>
  );
}
```

---

## Migration Guide

### Automated Codemod

Provide a codemod to automate most of the migration:

```bash
npx @react-split-pane/codemod v0.1-to-v3 src/
```

### Manual Migration Steps

#### 1. Update Props

```tsx
// Before
<SplitPane split="vertical" minSize={50} defaultSize={100}>
  <div>Pane 1</div>
  <div>Pane 2</div>
</SplitPane>

// After
<SplitPane direction="horizontal">
  <Pane minSize="50px" defaultSize="100px">
    <div>Pane 1</div>
  </Pane>
  <Pane>
    <div>Pane 2</div>
  </Pane>
</SplitPane>
```

#### 2. Update Event Handlers

```tsx
// Before
<SplitPane
  onDragStarted={handleStart}
  onChange={handleChange}
  onDragFinished={handleEnd}
/>

// After
<SplitPane
  onResizeStart={handleStart}
  onResize={(sizes) => handleChange(sizes[0])}
  onResizeEnd={(sizes) => handleEnd(sizes[0])}
/>
```

#### 3. Update Styling

```tsx
// Before
<SplitPane
  pane1Style={{ background: 'red' }}
  pane2Style={{ background: 'blue' }}
/>

// After
<SplitPane>
  <Pane style={{ background: 'red' }}>...</Pane>
  <Pane style={{ background: 'blue' }}>...</Pane>
</SplitPane>
```

---

## Accessibility Features

### Keyboard Navigation

- **Arrow Keys**: Resize divider (5px steps by default)
- **Shift + Arrow**: Larger steps (25px)
- **Home/End**: Minimize/maximize pane
- **Escape**: Cancel resize and restore original size

### ARIA Attributes

```html
<div role="separator"
     aria-valuenow="300"
     aria-valuemin="200"
     aria-valuemax="600"
     aria-label="Resize sidebar"
     aria-orientation="vertical"
     tabindex="0">
</div>
```

### Screen Reader Announcements

```tsx
// When resize completes:
announce('Sidebar resized to 300 pixels');

// When pane collapses:
announce('Sidebar collapsed');
```

### Focus Management

- Divider is focusable with `tabindex="0"`
- Visual focus indicator
- Focus trap during keyboard resize

---

## Performance Optimizations

### 1. RequestAnimationFrame Throttling

```typescript
const handleMouseMove = useCallback((e: MouseEvent) => {
  if (rafRef.current) return;

  rafRef.current = requestAnimationFrame(() => {
    updateSizes(e.clientX, e.clientY);
    rafRef.current = null;
  });
}, []);
```

### 2. Memoization

```typescript
const paneStyles = useMemo(() => ({
  width: direction === 'horizontal' ? `${size}px` : '100%',
  height: direction === 'vertical' ? `${size}px` : '100%',
}), [direction, size]);
```

### 3. Event Delegation

- Single mouse listener on document during drag
- Remove when not dragging

### 4. CSS Transform for Preview

Use transforms for drag preview (doesn't trigger reflow):

```typescript
// During drag, show preview with transform
dividerRef.current.style.transform = `translate${axis}(${delta}px)`;

// On drop, update actual sizes
updatePaneSizes(newSizes);
```

---

## Bundle Size Target

| Package | Size (gzipped) |
|---------|----------------|
| Core | < 3 KB |
| + Keyboard | < 4 KB |
| + Persistence | < 5 KB |
| Full | < 5 KB |

### Tree-Shaking Support

```typescript
// Only import what you need
import { SplitPane } from 'react-split-pane'; // Core only
import { useKeyboardResize } from 'react-split-pane/keyboard';
import { usePersistence } from 'react-split-pane/persistence';
```

---

## Testing Strategy

### Unit Tests (Vitest)

- Component rendering
- Prop validation
- Hook behavior
- Utility functions
- 95%+ coverage target

### Integration Tests (React Testing Library)

- Mouse drag interactions
- Touch gestures
- Keyboard navigation
- Controlled/uncontrolled modes
- Nested layouts

### Visual Regression Tests (Chromatic)

- All Storybook stories
- Different themes
- Responsive layouts

### E2E Tests (Playwright)

- Real browser interactions
- Cross-browser compatibility
- Mobile devices
- Accessibility audit

### Performance Tests

- Render performance
- Drag smoothness (60fps target)
- Memory leaks
- Bundle size

---

## Documentation Plan

### 1. API Reference

Auto-generated from TypeScript:
- Component props
- Hook signatures
- Type definitions
- Default values

### 2. Guides

- Getting Started
- Basic Usage
- Advanced Patterns
- Accessibility
- Performance
- Migration from v0.1
- TypeScript Usage

### 3. Examples

- CodeSandbox templates
- Common patterns
- Real-world applications
- Integration examples

### 4. Storybook

- Interactive component playground
- All prop combinations
- Visual examples
- Accessibility tests

---

## Release Strategy

### Version Timeline

- **3.0.0-alpha.1** (Week 6): Core features for early adopters
- **3.0.0-beta.1** (Week 10): Feature-complete, testing phase
- **3.0.0-rc.1** (Week 11): Release candidate
- **3.0.0** (Week 12): Stable release

### NPM Tags

```bash
npm install react-split-pane@latest  # v0.1.92 (current)
npm install react-split-pane@next    # v3.0.0-beta.1
npm install react-split-pane@alpha   # v3.0.0-alpha.1
```

### Support Policy

- **v3.x**: Active development, new features
- **v0.1.x**: Security fixes only for 12 months post-v3 release
- **v0.1.x EOL**: 12 months after v3 stable

---

## Open Questions

1. **Should we support 3+ panes in v3.0 or defer to v3.1?**
   - Pro: Future-proof API design
   - Con: Increases scope and timeline

2. **Persistence API: Built-in or separate hook?**
   - Option A: `<SplitPane persist="key">`
   - Option B: `const [sizes] = usePersistence('key')`

3. **Collapse animation: CSS or JS?**
   - CSS: Better performance
   - JS: More control, easier to coordinate with state

4. **TypeScript strict mode?**
   - Might break some edge cases
   - Better type safety

5. **Minimum React version?**
   - React 17 (broader compatibility)
   - React 18 (concurrent features)

---

## Success Metrics

### Adoption

- 1,000+ downloads in first month
- 10+ GitHub stars per week
- 5+ companies using in production

### Quality

- 95%+ test coverage
- 0 critical bugs in first 3 months
- < 5KB bundle size
- Lighthouse accessibility score: 100

### Community

- 10+ community contributions
- Active Discord/Discussions
- Regular blog posts/tutorials

---

## Conclusion

React Split Pane v3 represents a complete modernization of the library, bringing it in line with current React best practices while maintaining the simplicity that made v0.1 popular. By focusing on TypeScript, accessibility, and developer experience, v3 will position the library for the next 5 years of React development.

**Next Steps:**

1. ✅ Community feedback on this proposal
2. ⏳ Set up new repository (or branch?)
3. ⏳ Begin Phase 1 implementation
4. ⏳ Regular progress updates

**Questions? Comments?**

Please provide feedback on this proposal in GitHub Discussions or open an issue with your thoughts.
