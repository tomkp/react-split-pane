import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import prefixAll from 'inline-style-prefixer/static';

import {getUnit} from "./SplitPane";

const RowPx = ({ useInitial, initialSize, size, minSize, maxSize }) => ({
  width: useInitial && initialSize ? initialSize : size + 'px',
  minWidth: minSize,
  maxWidth: maxSize,
  outline: 'none',
});

const ColumnPx = ({ useInitial, initialSize, size, minSize, maxSize }) => ({
  height: useInitial && initialSize ? initialSize : size + 'px',
  minHeight: minSize,
  maxHeight: maxSize,
  outline: 'none',
});

const RowFlex = ({ initialSize, size, minSize, maxSize }) => {
  const value = size ? size : initialSize;

  const style = {
    minWidth: minSize,
    maxWidth: maxSize,
    display: 'flex',
    outline: 'none',
    position: 'relative'
  };

  if (getUnit(value) === "ratio") {
    style.flex = value;
  } else {
    style.flexGrow = 0;
    style.width = value;
  }

  return style;
};

const ColumnFlex = ({ initialSize, size, minSize, maxSize }) => {
  const value = size ? size : initialSize;

  const style = {
    minHeight: minSize,
    maxHeight: maxSize,
    display: 'flex',
    outline: 'none',
    flexShrink: 1,
    position: 'relative'
  };

  if (getUnit(value) === "ratio") {
    style.flex = value;
  } else {
    style.flexGrow = 0;
    style.height = value;
  }

  return style;
};


class Pane extends PureComponent {
  render() {
    const {
      children,
      className,
      split,
      useInitial,
    } = this.props;

    let prefixedStyle;

    if (split === 'vertical') {
      prefixedStyle = prefixAll(RowFlex(this.props));
    } else {
      prefixedStyle = prefixAll(ColumnFlex(this.props));
    }

    return (
      <div className={className} style={prefixedStyle}>
        {children}
      </div>
    );
  }
}

Pane.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  initialSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minSize: PropTypes.string,
  maxSize: PropTypes.string,
};

Pane.defaultProps = {
  initialSize: "1",
  split: 'vertical',
  minSize: '0',
  maxSize: '100%',
};

export default Pane;
