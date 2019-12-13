import React from 'react';
import SplitPane from '../../../src';

const Button = () => {
  const buttonStyle = {
    backgroundColor: 'green',
    textAlign: 'center',
    borderRadius: '50%',
  };
  return <button style={buttonStyle}>></button>;
};

export default () => (
  <SplitPane split="vertical" className="primary" resizerChildren={<Button />}>
    <div></div>
    <div />
  </SplitPane>
);
