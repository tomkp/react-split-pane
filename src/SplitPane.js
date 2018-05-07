import React, { Component, cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

import glamorous from 'glamorous';
import Resizer from './Resizer';
import Pane from './Pane';

const DEFAULT_PANE_SIZE = "1";
const DEFAULT_PANE_MIN_SIZE = "0";
const DEFAULT_PANE_MAX_SIZE = "100%";

const ColumnStyle = glamorous.div({
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  flex: 1,
  outline: 'none',
  overflow: 'hidden',
  userSelect: 'text',

  minHeight: '100%',
  width: '100%'
});

const RowStyle = glamorous.div({
  display: 'flex',
  height: '100%',
  flexDirection: 'row',
  flex: 1,
  outline: 'none',
  overflow: 'hidden',
  userSelect: 'text'
});

function convert(str, size) {
  const tokens = str.match(/([0-9]+)([px|%]*)/);
  const value = tokens[1];
  const unit = tokens[2];
  return toPx(value, unit, size);
}

function toPx(value, unit = 'px', size) {
  switch (unit) {
    case '%': {
      return +(size * value / 100).toFixed(2);
    }
    default: {
      return +value;
    }
  }
}

export function getUnit(size) {
  if (typeof size === "number") {
    return "ratio";
  }

  if(size.endsWith("px")) {
    return "px";
  }

  if(size.endsWith("%")) {
    return "%";
  }

  return "ratio";
}

export function convertSizeToCssValue(value, resizersSize) {
  if(getUnit(value) !== "%") {
    return value;
  }

  if (!resizersSize) {
    return value;
  }

  const idx = value.search("%");
  const percent = value.slice(0, idx) / 100;
  if (percent === 0) {
    return value;
  }

  return `calc(${value} - ${resizersSize}px*${percent})`
}

function convertToUnit(size, unit, containerSize) {
  switch(unit) {
    case "%":
      return `${(size / containerSize * 100).toFixed(2)}%`;
    case "px":
      return `${size.toFixed(2)}px`;
    case "ratio":
      return (size * 100).toFixed(0);
  }
}

class SplitPane extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sizes: this.getPanePropSize(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({sizes: this.getPanePropSize(nextProps)});
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);

    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onMouseUp);
  }

  componentDidMount() {
    // todo: if there are percentage panes
    this.forceUpdate();
  }

  onMouseDown = (event, resizerIndex) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();

    this.onDown(resizerIndex);
  }

  onTouchStart = (event, resizerIndex) => {
    event.preventDefault();

    this.onDown(resizerIndex);
  }

  onDown = (resizerIndex) => {
    const {allowResize, onResizeStart} = this.props;

    if (!allowResize) {
      return;
    }

    this.dimensions = this.getPaneDimensions();
    this.container = this.splitPane.getBoundingClientRect();
    this.resizerIndex = resizerIndex;
    this.resizersSize = this.getResizersSize();

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);

    document.addEventListener('touchmove', this.onTouchMove);
    document.addEventListener('touchend', this.onMouseUp);
    // document.addEventListener('touchcancel', this.onMouseUp);

    if (onResizeStart) {
      onResizeStart(resizerIndex);
    }
  }

  onMouseMove = (event) => {
    event.preventDefault();

    this.onMove(event.clientX, event.clientY);
  }

  onTouchMove = (event) => {
    event.preventDefault();

    const {clientX, clientY} = event.touches[0];

    this.onMove(clientX, clientY);
  }

  onMouseUp = (event) => {
    event.preventDefault();

    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);

    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onMouseUp);

    if (this.props.onResizeEnd) {
      this.props.onResizeEnd();
    }
  }

  getPanePropSize(props) {
    return React.Children.map(props.children, child => {
      const value = child.props["size"] || child.props["initialSize"];
      if (value === undefined) {
        return DEFAULT_PANE_SIZE;
      }
      
      return String(value);
    });
  }

  getPanePropMinMaxSize(props, key) {
    return React.Children.map(props.children, child => {
      const value = child.props[key];
      if (value === undefined) {
        return key === "maxSize" ? DEFAULT_PANE_MAX_SIZE : DEFAULT_PANE_MIN_SIZE;
      }
      
      return value;
    });
  }

  getPaneDimensions() {
    return this.paneElements.map(el => findDOMNode(el).getBoundingClientRect());
  }

  getResizerDimensions() {
    return this.resizerElements.map(el => findDOMNode(el).getBoundingClientRect())
  }

  getSizes() {
      return this.state.sizes;
  }

  onMove(clientX, clientY) {
    const { split, resizerSize, onChange } = this.props;
    const minSizes = this.getPanePropMinMaxSize(this.props, 'minSize');
    const maxSizes = this.getPanePropMinMaxSize(this.props, 'maxSize');
    const resizerIndex = this.resizerIndex;
    const dimensions = this.dimensions;
    const splitPaneDimensions = this.container;
    const sizesPx = dimensions.map(d => split === "vertical" ? d.width : d.height);

    const primary = dimensions[resizerIndex];
    const secondary = dimensions[resizerIndex + 1];

    const splitPaneSizePx = split === "vertical"
      ? splitPaneDimensions.width - this.resizersSize
      : splitPaneDimensions.height - this.resizersSize;

    let primarySizePx;
    let secondarySizePx;

    const primaryMinSizePx = convert(minSizes[resizerIndex], splitPaneSizePx);
    const secondaryMinSizePx = convert(minSizes[resizerIndex + 1], splitPaneSizePx);

    const primaryMaxSizePx = convert(maxSizes[resizerIndex], splitPaneSizePx);
    const secondaryMaxSizePx = convert(maxSizes[resizerIndex + 1], splitPaneSizePx);

    const resizerSize1 = resizerSize / 2;
    const resizerSize2 = resizerSize / 2;

    if (split === 'vertical') {
      const mostLeft = Math.max(
        primary.left + resizerSize1,
        primary.left + primaryMinSizePx + resizerSize1,
        secondary.right - secondaryMaxSizePx - resizerSize2
      );
      const mostRight = Math.min(
        secondary.right - resizerSize2,
        secondary.right - secondaryMinSizePx - resizerSize2,
        primary.left + primaryMaxSizePx + resizerSize1
      );

      clientX = clientX < mostLeft ? mostLeft : clientX;
      clientX = clientX > mostRight ? mostRight : clientX;

      const resizerLeft = clientX - resizerSize1;
      const resizerRight = clientX + resizerSize2;

      primarySizePx = resizerLeft - primary.left;
      secondarySizePx = secondary.right - resizerRight;
    } else {
      const mostTop = Math.max(
        primary.top + resizerSize1,
        primary.top + primaryMinSizePx + resizerSize1,
        secondary.bottom - secondaryMaxSizePx - resizerSize2
      );
      const mostBottom = Math.min(
        secondary.bottom - resizerSize2,
        secondary.bottom - secondaryMinSizePx - resizerSize2,
        primary.top + primaryMaxSizePx + resizerSize1
      );

      clientY = clientY < mostTop ? mostTop : clientY;
      clientY = clientY > mostBottom ? mostBottom : clientY;

      const resizerTop = clientY - resizerSize1;
      const resizerBottom = clientY + resizerSize2;

      primarySizePx = resizerTop - primary.top;
      secondarySizePx = secondary.bottom - resizerBottom;
    }

    sizesPx[resizerIndex] = primarySizePx;
    sizesPx[resizerIndex + 1] = secondarySizePx;

    const panesSizes = [primarySizePx, secondarySizePx];
    let sizes = this.getSizes().concat();
    let updateRatio;

    panesSizes.forEach((paneSize, idx) => {
      const unit = getUnit(sizes[resizerIndex + idx]);
      if (unit !== "ratio") {
        sizes[resizerIndex + idx] = convertToUnit(paneSize, unit, splitPaneSizePx);
      } else {
        updateRatio = true;
      }
    });

    if (updateRatio) {
      let ratioCount = 0;
      let lastRatioIdx;
      sizes = sizes.map((size, idx) => {
        if (getUnit(size) === "ratio") {
          ratioCount++;
          lastRatioIdx = idx;
          return convertToUnit(sizesPx[idx], "ratio");
        }

        return size;
      });

      if (ratioCount === 1) {
        sizes[lastRatioIdx] = '1';
      }
    }

    onChange && onChange(sizes);

    this.setState({
      sizes
    });
  }

  setPaneRef = (idx, el) => {
    if (!this.paneElements) {
      this.paneElements = [];
    }

    this.paneElements[idx] = el;
  }

  setResizerRef = (idx, el) => {
    if (!this.resizerElements) {
      this.resizerElements = [];
    }

    this.resizerElements[idx] = el;
  }

  getResizersSize() {
    if (!this.resizerElements) {
      return 0;
    }

    return this.resizerElements.length * this.props.resizerSize;
  }

  render() {
    const { children, className, split } = this.props;
    const sizes = this.getSizes();

    const resizersSize = this.getResizersSize();

    const elements = children.reduce((acc, child, idx) => {
      let pane;
      const resizerIndex = idx - 1;
      const isPane = child.type === Pane;
      const paneProps = {
        index: idx,
        'data-type': 'Pane',
        split: split,
        key: `Pane-${idx}`,
        ref: this.setPaneRef.bind(null, idx),
        resizersSize
      };

      if (sizes) {
        paneProps.size = sizes[idx];
      }

      if (isPane) {
        pane = cloneElement(child, paneProps);
      } else {
        pane = <Pane {...paneProps}>{child}</Pane>;
      }

      if (acc.length === 0) {
        return [...acc, pane];
      } else {
        const resizer = (
          <Resizer
            index={resizerIndex}
            key={`Resizer-${resizerIndex}`}
            ref={this.setResizerRef.bind(null, resizerIndex)}
            split={split}
            onMouseDown={this.onMouseDown}
            onTouchStart={this.onTouchStart}
          />
        );

        return [...acc, resizer, pane];
      }
    }, []);

    const StyleComponent = split === 'vertical' ? RowStyle : ColumnStyle;

    return (
      <StyleComponent
        className={className}
        data-type="SplitPane"
        data-split={split}
        innerRef={el => (this.splitPane = el)}
      >
        {elements}
      </StyleComponent>
    );
  }
}

SplitPane.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  className: PropTypes.string,
  split: PropTypes.oneOf(['vertical', 'horizontal']),
  resizerSize: PropTypes.number,
  onChange: PropTypes.func,
  onResizeStart: PropTypes.func,
  onResizeEnd: PropTypes.func,
};

SplitPane.defaultProps = {
  split: 'vertical',
  resizerSize: 1,
  allowResize: true
};

export default SplitPane;
