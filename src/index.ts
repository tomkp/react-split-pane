export { SplitPane } from './components/SplitPane';
export { Pane } from './components/Pane';
export { Divider } from './components/Divider';

export type {
  SplitPaneProps,
  PaneProps,
  DividerProps,
  Direction,
  Size,
  ResizeEvent,
} from './types';

// Re-export hooks for advanced usage
export { useResizer } from './hooks/useResizer';
export { useKeyboardResize } from './hooks/useKeyboardResize';
export { usePersistence } from './persistence';
