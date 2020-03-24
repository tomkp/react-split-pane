import React from 'react';
import SplitPane from '../src';

export default () => (
  <SplitPane split="vertical" defaultSize="33%">
    <div>pane 1 size: 33%</div>
    <SplitPane split="vertical" defaultSize="50%">
      <div>pane 2 size: 50% (of remaining space)</div>
      <div>pane 3</div>
    </SplitPane>
  </SplitPane>
);
