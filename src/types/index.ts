import type { CSSProperties, ReactNode } from 'react';

export type Direction = 'horizontal' | 'vertical';

export type Size = string | number;

export interface ResizeEvent {
  sizes: number[];
  source: 'pointer' | 'keyboard';
  /** The type of pointer that initiated the resize (mouse, touch, or pen) */
  pointerType?: 'mouse' | 'touch' | 'pen';
  originalEvent?: PointerEvent | KeyboardEvent;
}

export interface SplitPaneProps {
  /** Layout direction - horizontal means panes are side-by-side */
  direction?: Direction;

  /** Whether panes can be resized */
  resizable?: boolean;

  /** Snap points for auto-alignment (in pixels) */
  snapPoints?: number[];

  /** Snap tolerance in pixels */
  snapTolerance?: number;

  /** Step size for keyboard resize in pixels */
  step?: number;

  /** Called when resize starts */
  onResizeStart?: (event: ResizeEvent) => void;

  /** Called during resize - consider debouncing this */
  onResize?: (sizes: number[], event: ResizeEvent) => void;

  /** Called when resize ends */
  onResizeEnd?: (sizes: number[], event: ResizeEvent) => void;

  /** CSS class name */
  className?: string;

  /** Inline styles */
  style?: CSSProperties;

  /** Custom divider component */
  divider?: React.ComponentType<DividerProps>;

  /** Custom divider styles */
  dividerStyle?: CSSProperties;

  /** Custom divider class name */
  dividerClassName?: string;

  /** Size of the divider in pixels (used for accurate pane size calculations) */
  dividerSize?: number;

  /** Pane children */
  children: ReactNode;
}

export interface PaneProps {
  /** Initial size (uncontrolled mode) */
  defaultSize?: Size;

  /** Controlled size */
  size?: Size;

  /** Minimum size */
  minSize?: Size;

  /** Maximum size */
  maxSize?: Size;

  /** CSS class name */
  className?: string;

  /** Inline styles */
  style?: CSSProperties;

  /** Pane content */
  children: ReactNode;
}

export interface DividerProps {
  /** Layout direction */
  direction: Direction;

  /** Index of this divider (0-based) */
  index: number;

  /** Whether divider is being dragged */
  isDragging: boolean;

  /** Whether divider can be interacted with */
  disabled: boolean;

  /** Pointer down handler (handles mouse, touch, and pen input) */
  onPointerDown: (e: React.PointerEvent) => void;

  /**
   * Mouse down handler
   * @deprecated Use onPointerDown instead. This is provided for backwards compatibility.
   */
  onMouseDown?: (e: React.MouseEvent) => void;

  /**
   * Touch start handler
   * @deprecated Use onPointerDown instead. This is provided for backwards compatibility.
   */
  onTouchStart?: (e: React.TouchEvent) => void;

  /**
   * Touch end handler
   * @deprecated Use onPointerDown instead. This is provided for backwards compatibility.
   */
  onTouchEnd?: (e: React.TouchEvent) => void;

  /** Keyboard handler */
  onKeyDown: (e: React.KeyboardEvent) => void;

  /** CSS class name */
  className?: string | undefined;

  /** Inline styles */
  style?: CSSProperties | undefined;

  /** Current size values for ARIA */
  currentSize?: number | undefined;
  minSize?: number | undefined;
  maxSize?: number | undefined;

  /** Custom content */
  children?: ReactNode | undefined;
}
