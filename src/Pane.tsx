import React, { useMemo, forwardRef } from 'react';

export interface PaneProps {
  className: string;
  split: 'vertical' | 'horizontal';
  size: React.CSSProperties['width'];
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export type PaneRef = HTMLDivElement | null;

// returns something like 'width10pxpadding10px'
// this is kinda safe to do since CSSproperties are one level deep
export function stringifyStyle(style?: React.CSSProperties): string {
  if (!style) {
    return '';
  }

  return Object.entries(style)
    .flatMap(s => `${s[0]}${s[1]}`)
    .join('');
}

const Pane = forwardRef<PaneRef, PaneProps>((props, forwardedRef) => {
  const style = useMemo(() => {
    const res: React.CSSProperties = {
      ...props.style,
      flex: 1,
      position: 'relative',
      outline: 'none',
    };

    if (props.size !== undefined) {
      if (props.split === 'vertical') {
        res.width = props.size;
      } else {
        res.height = props.size;
        res.display = 'flex';
      }
      res.flex = 'none';
    }

    return res;
  }, [stringifyStyle(props.style), props.size, props.split]);

  const className = ['Pane', props.split, props.className].join(' ');

  return (
    <div ref={forwardedRef} className={className} style={style}>
      {props.children}
    </div>
  );
});

export default Pane;
