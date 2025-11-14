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
  PaneState,
} from './types';

// Re-export hooks for advanced usage
export { useResizer } from './hooks/useResizer';
export { usePaneSize } from './hooks/usePaneSize';
