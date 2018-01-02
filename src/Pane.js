import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import prefixAll from 'inline-style-prefixer/static';

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

const RowFlex = ({ ratio, minSize, maxSize }) => ({
  flex: ratio * 100,
  minWidth: minSize,
  maxWidth: maxSize,
  display: 'flex',
  outline: 'none',
});

const ColumnFlex = ({ ratio, minSize, maxSize }) => ({
  flex: ratio * 100,
  minHeight: minSize,
  maxHeight: maxSize,
  display: 'flex',
  outline: 'none',
});


class Pane extends PureComponent {
  render() {
    const {
      children,
      className,
      resized,
      split,
      useInitial,
      initialSize,
    } = this.props;

    let prefixedStyle;

    //console.log(`Pane.render`, resized && !(useInitial && initialSize), resized, useInitial, initialSize);

    if (resized && !(useInitial && initialSize)) {
      if (split === 'vertical') {
        prefixedStyle = prefixAll(RowFlex(this.props));
      } else {
        prefixedStyle = prefixAll(ColumnFlex(this.props));
      }
    } else {
      if (split === 'vertical') {
        prefixedStyle = prefixAll(RowPx(this.props));
      } else {
        prefixedStyle = prefixAll(ColumnPx(this.props));
      }
    }
    return (
      <div className={className} style={prefixedStyle}>
        {children}
      </div>
    );
  }
}

Pane.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  initialSize: PropTypes.string,
  minSize: PropTypes.string,
  maxSize: PropTypes.string,
};

Pane.defaultProps = {
  split: 'vertical',
  minSize: '0px',
  maxSize: '100%',
};

export default Pane;
