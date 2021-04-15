import * as React from 'react';

export type Size = string | number;

export interface Props {
    allowResize?: boolean;
    className?: string;
    split?: 'vertical' | 'horizontal';
    resizerSize?: number;
    onChange?: (newSize: number) => void;
    onResizeStart?: (newSize: Size) => void;
    onResizeEnd?: (newSize: Size) => void;
}

export interface State {
    sizes: string;
}

declare class SplitPane extends React.Component<Props, State> {
    constructor();

    onMouseDown(event: MouseEvent): void;
    
    onTouchStart(event: TouchEvent): void;

    onMouseMove(event: MouseEvent): void;

    onTouchMove(event: TouchEvent): void;

    onMouseUp(): void;

    static defaultProps: Props;
}

export { SplitPane as default };
