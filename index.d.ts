import React, { CSSProperties } from 'react';
import Prefixer from 'inline-style-prefixer';

export type Size = string | number;

export interface Props {
    allowResize?: boolean;
    className?: string;
    primary?: 'first' | 'second';
    minSize?: Size;
    maxSize?: Size;
    defaultSize?: Size;
    size?: Size;
    split?: 'vertical' | 'horizontal';
    onDragStarted?: () => void;
    onDragFinished?: () => void;
    onChange?: (newSize: number) => void;
    onResizerClick?: (event: MouseEvent) => void;
    onResizerDoubleClick?: (event: MouseEvent) => void;
    prefixer?: Prefixer;
    style?: CSSProperties;
    resizerStyle?: CSSProperties;
    paneStyle?: CSSProperties;
    pane1Style?: CSSProperties;
    pane2Style?: CSSProperties;
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

    setSize(props: Props, state: State): void;

    static defaultProps: Props;
}

export { SplitPane as default };