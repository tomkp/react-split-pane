import React, { Component, PropTypes } from 'react';

class HSplit extends Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  render() {
    const style = {
      cursor: 'row-resize',
      background: '#EEEEEE',
      borderBottom: 'solid #E0E0E0 1px',
      borderTop: 'solid #E0E0E0 1px',
      height: '3px',
      width: '100%',
    };

    return (
      <div style={style}></div>
    );
  }
}

export default HSplit;
