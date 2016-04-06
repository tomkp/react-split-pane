import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import SplitPane from '../lib/SplitPane';

const HSplit = React.createClass({
  render() {
    const style = {
      cursor: 'row-resize',
      background: '#EEEEEE',
      borderBottom: 'solid #E0E0E0 1px',
      borderTop: 'solid #E0E0E0 1px',
      width: '100%',
    };

    const headerStyle = {
      color: '#888',
      float: 'left',
      fontFamily: 'sans-serif',
      fontSize: '11px',
      letterSpacing: '1px',
      lineHeight: 1,
      margin: 0,
      padding: '8px 10px 8px 10px',
      textTransform: 'uppercase',
    };

    const buttonStyle = {
      background: 'transparent',
      border: 'none',
      color: '#888',
      float: 'right',
      fontFamily: 'sans-serif',
      fontSize: '11px',
      lineHeight: 1,
      outline: 'none',
      padding: '8px 15px 8px 10px',
    };

    const clearFix = {
      clear: 'both',
    };

    return (
      <div style={style}>
        <h3 style={headerStyle}>{this.props.header}</h3>
        <button style={buttonStyle} onClick={this.props.onClose}>✕</button>
        <div style={clearFix}></div>
      </div>
    );
  }
});

HSplit.propTypes = {
  onClose: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
};

var Example = React.createClass({
    render: function() {
        const close = () => alert('close button clicked');
        const hsplit = <HSplit header="Split Pane Header" onClose={close} />;

        return (
            <SplitPane split="vertical" minSize={50} maxSize={300} defaultSize={250} className="primary">
                <div></div>
                <SplitPane split="horizontal" primary="second" defaultSize={250} resizerChildren={hsplit}>
                    <div></div>
                    <div></div>
                </SplitPane>
            </SplitPane>
        );
    }

});


ReactDOM.render(<Example />, document.getElementById("container"));
