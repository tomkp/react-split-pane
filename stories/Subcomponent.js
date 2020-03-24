import React from 'react';
import SplitPane from '../src';

export default () => (
  <div className="parent">
    <div className="header">Header</div>
    <div className="wrapper">
      <SplitPane split="horizontal" defaultSize="50%">
        <div />
        <div />
      </SplitPane>
    </div>
  </div>
);
