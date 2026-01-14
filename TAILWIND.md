# Tailwind CSS & shadcn/ui Integration

React Split Pane works seamlessly with Tailwind CSS and shadcn/ui. The component uses plain CSS and inline styles (no CSS-in-JS), so there are no conflicts with utility-first frameworks.

## Using Tailwind Classes

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

## shadcn/ui Integration

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

## Custom Divider with shadcn

Create a themed divider component using shadcn's `cn` utility:

```tsx
import { cn } from '@/lib/utils';
import type { DividerProps } from 'react-split-pane';

function ThemedDivider(props: DividerProps) {
  const {
    direction,
    isDragging,
    disabled,
    onMouseDown,
    onTouchStart,
    onTouchEnd,
    onKeyDown,
  } = props;

  return (
    <div
      role="separator"
      aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
      tabIndex={disabled ? -1 : 0}
      onMouseDown={disabled ? undefined : onMouseDown}
      onTouchStart={disabled ? undefined : onTouchStart}
      onTouchEnd={disabled ? undefined : onTouchEnd}
      onKeyDown={disabled ? undefined : onKeyDown}
      className={cn(
        'flex items-center justify-center transition-colors',
        'bg-border hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring',
        direction === 'horizontal'
          ? 'w-1 cursor-col-resize'
          : 'h-1 cursor-row-resize',
        isDragging && 'bg-primary',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      &nbsp;
    </div>
  )
}

<SplitPane divider={ThemedDivider}>
  <Pane>Left</Pane>
  <Pane>Right</Pane>
</SplitPane>
```

## CSS Variables with Tailwind

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
