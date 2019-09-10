import * as React from 'react';

export type Size = string | number;

type Partial<T> = { [P in keyof T]?: T[P] };

export interface Props {
  allowResize?: boolean;
  className?: string;
  primary?: 'first' | 'second';
  minSize?: Size;
  maxSize?: Size;
  defaultSize?: Size;
  size?: Size;
  split?: 'vertical' | 'horizontal';
  onDragStarted?: (evt: TouchEvent) => void;
  onDragFinished?: (newSize: number, evt: TouchEvent) => void;
  onChange?: (newSize: number, evt: MouseEvent | TouchEvent) => void;
  onResizerClick?: (event: MouseEvent, evt: MouseEvent | TouchEvent) => void;
  onResizerDoubleClick?: (event: MouseEvent) => void;
  style?: React.CSSProperties;
  resizerStyle?: React.CSSProperties;
  paneStyle?: React.CSSProperties;
  pane1Style?: React.CSSProperties;
  pane2Style?: React.CSSProperties;
  resizerClassName?: string;
  step?: number;
}

export interface State {
  active: boolean;
  resized: boolean;
}

declare class SplitPane extends React.Component<Props, State> {
  constructor();

  onMouseDown(event: MouseEvent): void;

  onTouchStart(event: TouchEvent): void;

  onMouseMove(event: MouseEvent): void;

  onTouchMove(event: TouchEvent): void;

  onMouseUp(): void;

  static getSizeUpdate(props: Props, state: State): Partial<State>;

  static defaultProps: Props;
}

export default SplitPane;
