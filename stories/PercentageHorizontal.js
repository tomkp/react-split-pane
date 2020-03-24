import React from 'react';
import SplitPane from '../src';

export default () => (
  <SplitPane defaultSize="50%" split="horizontal">
    <div>default percentage: 50%</div>
    <div />
  </SplitPane>
);
