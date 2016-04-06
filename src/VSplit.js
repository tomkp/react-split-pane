import React, { Component, PropTypes } from 'react';

class VSplit extends Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  render() {
    const style = {
      cursor: 'col-resize',
      background: '#EEEEEE',
      borderLeft: 'solid #E0E0E0 1px',
      borderRight: 'solid #E0E0E0 1px',
      height: '100%',
      width: '3px',
    };

    return (
      <div style={style}></div>
    );
  }
}

export default VSplit;
