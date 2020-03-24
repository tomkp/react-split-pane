import React from 'react';
import SplitPane from '../src';

export default () => {
  const styleA = { background: '#eee' };
  const styleB = { background: '#aaa4ba' };
  const styleC = { background: '#000' };
  const styleD = { padding: '2em', fontStyle: 'italic' };
  return (
    <SplitPane
      split="vertical"
      minSize={50}
      maxSize={300}
      defaultSize={100}
      className="primary"
      pane1Style={styleA}
      resizerStyle={styleC}
    >
      <div />
      <SplitPane split="horizontal" paneStyle={styleD} pane2Style={styleB}>
        <div>Hello...</div>
        <div> ...world.</div>
      </SplitPane>
    </SplitPane>
  );
};
