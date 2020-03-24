import React from 'react';
import SplitPane from '../src';

export default class SnapToPositionExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: undefined,
      dragging: false,
    };
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  handleDragStart() {
    this.setState({
      dragging: true,
    });
  }

  handleDragEnd() {
    this.setState({
      dragging: false,
    });
    setTimeout(() => {
      this.setState({ size: undefined });
    }, 0);
  }

  handleDrag(width) {
    if (width >= 300 && width <= 400) {
      this.setState({ size: 300 });
    } else if (width > 400 && width <= 500) {
      this.setState({ size: 500 });
    } else {
      this.setState({ size: undefined });
    }
  }

  render() {
    const dropWarnStyle = {
      backgroundColor: 'yellow',
      left: 300,
      width: 200,
    };
    const centeredTextStyle = {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    };
    return (
      <div style={{ height: '100%' }}>
        <SplitPane
          size={this.state.dragging ? undefined : this.state.size}
          onChange={this.handleDrag}
          onDragStarted={this.handleDragStart}
          onDragFinished={this.handleDragEnd}
        >
          <div
            style={{
              backgroundColor: 'blue',
              height: '100%',
              zIndex: 1,
              opacity: 0.1,
            }}
          />
          <div />
        </SplitPane>
        <div
          style={Object.assign({}, centeredTextStyle, { left: 0, width: 300 })}
        >
          Can drop anywhere
        </div>
        <div style={Object.assign({}, centeredTextStyle, dropWarnStyle)}>
          Will snap to edges
        </div>
        <div
          style={Object.assign({}, centeredTextStyle, {
            left: 500,
            width: 'calc(100% - 500px)',
          })}
        >
          Can drop anywhere
        </div>
      </div>
    );
  }
}
