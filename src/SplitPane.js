import React, { Component, cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

import glamorous from 'glamorous';
import Resizer from './Resizer';
import Pane from './Pane';

const debug = true;

const log = (...args) => {
  if (debug) console.log(...['SplitPane', ...args]);
};

const ColumnStyle = glamorous.div({
  display: 'flex',
  flex: 1,
  height: '100%',
  outline: 'none',
  overflow: 'hidden',
  userSelect: 'text',

  flexDirection: 'column',
  minHeight: '100%',
  width: '100%',
});

const RowStyle = glamorous.div({
  display: 'flex',
  flex: 1,
  height: '100%',
  outline: 'none',
  overflow: 'hidden',
  userSelect: 'text',

  flexDirection: 'row',
});

const paneSize = (split, dimensions, splitPaneDimensions) => {
  const sizes = dimensions.map(dimension =>
    (split === 'vertical' ? dimension.width : dimension.height).toFixed(2)
  );
  const ratios = dimensions.map(
    dimension =>
      split === 'vertical'
        ? Math.round(
            (dimension.width / splitPaneDimensions.width).toFixed(2) * 100
          )
        : Math.round(
            (dimension.height / splitPaneDimensions.height).toFixed(2) * 100
          )
  );
  return { sizes, ratios };
};

const convert = (str, size) => {
  const tokens = str.match(/([0-9]+)([px|%]*)/);
  const value = tokens[1];
  const unit = tokens[2];
  return toPx(value, unit, size);
};

const toPx = (value, unit = 'px', size) => {
  switch (unit) {
    case '%': {
      return (size * value / 100).toFixed(2);
    }
    default: {
      return +value;
    }
  }
};

class SplitPane extends Component {
  constructor(props) {
    super(props);
    log(`constructor`);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onDown = this.onDown.bind(this);
    this.calculateSize = this.calculateSize.bind(this);
    this.resize = this.resize.bind(this);

    const paneCount = props.children.length;
    this.state = {
      useInitial: true,
      resized: true,
      active: false,
      dimensions: [],
      sizes: [],
      ratios: Array(paneCount).fill((100 / paneCount).toFixed(2)),
    };
    this.resizeTimer = undefined;
  }

  resize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.calculateSize();
    }, 100);
  }

  componentDidMount() {
    log(`componentDidMount`);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('resize', this.resize);
    this.calculateSize();
  }

  componentWillUnmount() {
    log(`componentWillUnmount`);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('resize', this.resize);
  }

  onMouseDown(event, resizerIndex) {
    log(`onMouseDown`, resizerIndex);
    this.onDown();
    this.setState({
      resizer: resizerIndex,
    });
  }

  onTouchStart(event, resizerIndex) {
    log(`onTouchStart`, resizerIndex);
    this.onDown();
    this.setState({
      resizer: resizerIndex,
    });
  }

  onDown() {
    log(`onDown`);
    const { allowResize = true } = this.props;
    if (allowResize) {
      this.setState({
        active: true,
        resized: false,
      });
    }
  }

  onMouseMove(event) {
    this.onMove(event.clientX, event.clientY);
  }

  onTouchMove(event) {
    this.onMove(event.touches[0].clientX, event.touches[0].clientY);
  }

  onMouseUp() {
    log(`onMouseUp`);
    const { split } = this.props;
    const { active } = this.state;
    const dimensions = this.getPaneDimensions();
    const node = findDOMNode(this.splitPane);
    const splitPaneDimensions = findDOMNode(node).getBoundingClientRect();
    const { ratios, sizes } = paneSize(split, dimensions, splitPaneDimensions);

    if (active) {
      this.setState({
        active: false,
        dimensions,
        sizes,
        ratios,
      });
    }
  }

  calculateSize() {
    log('calculateSize', this.state);
    const { split } = this.props;
    const dimensions = this.getPaneDimensions();
    const node = findDOMNode(this.splitPane);
    if (node) {
      const splitPaneDimensions = findDOMNode(node).getBoundingClientRect();
      const { ratios, sizes } = paneSize(
        split,
        dimensions,
        splitPaneDimensions
      );

      this.setState({
        useInitial: false,
        resized: true,
        dimensions,
        sizes,
        ratios,
      });
    }
  }

  getPropForRef(refs, key) {
    return Object.keys(refs).map(ref => refs[ref].props[key]);
  }

  getPaneDimensions() {
    const refs = this.refs;
    return Object.keys(refs).map(ref =>
      findDOMNode(refs[ref]).getBoundingClientRect()
    );
  }

  onMove(clientX, clientY) {
    const { split } = this.props;
    const { active, dimensions, resizer } = this.state;

    if (active) {
      log(`onMove ${clientX},${clientY}`, this.state);
      const node = findDOMNode(this.splitPane);
      const splitPaneDimensions = findDOMNode(node).getBoundingClientRect();

      const primary = dimensions[resizer];
      const secondary = dimensions[resizer + 1];

      const refs = this.refs;
      const minSizes = this.getPropForRef(refs, 'minSize');
      const maxSizes = this.getPropForRef(refs, 'maxSize');

      log('min, max sizes', minSizes, maxSizes);

      if (
        (split === 'vertical' &&
          clientX > primary.left &&
          clientX < secondary.right) ||
        (split !== 'vertical' &&
          clientY > primary.top &&
          clientY < secondary.bottom)
      ) {
        this.setState(state => {
          let primarySize;
          let secondarySize;
          let splitPaneSize;

          if (split === 'vertical') {
            primarySize = clientX - primary.left;
            secondarySize = secondary.right - clientX;
            splitPaneSize = splitPaneDimensions.width;
          } else {
            primarySize = clientY - primary.top;
            secondarySize = secondary.bottom - clientY;
            splitPaneSize = splitPaneDimensions.height;
          }

          const primaryMinSize = convert(minSizes[resizer], splitPaneSize);
          const secondaryMinSize = convert(
            minSizes[resizer + 1],
            splitPaneSize
          );

          const primaryMaxSize = convert(maxSizes[resizer], splitPaneSize);
          const secondaryMaxSize = convert(
            maxSizes[resizer + 1],
            splitPaneSize
          );

          if (
            primaryMinSize <= primarySize &&
            primaryMaxSize >= primarySize &&
            secondaryMinSize <= secondarySize &&
            secondaryMaxSize >= secondarySize
          ) {
            const primaryRatio = (primarySize / splitPaneSize).toFixed(2);
            const secondaryRatio = (secondarySize / splitPaneSize).toFixed(2);

            const { ratios, sizes } = state;

            sizes[resizer] = primarySize;
            sizes[resizer + 1] = secondarySize;

            ratios[resizer] = primaryRatio;
            ratios[resizer + 1] = secondaryRatio;

            return {
              useInitial: false,
              ratios,
              sizes,
              ...state,
            };
          }
          return state;
        });
      }
    }
  }

  render() {
    log('render', this.state);
    const { children, className, split } = this.props;
    const { ratios, sizes, resized, useInitial } = this.state;
    let paneIndex = 0;
    let resizerIndex = 0;

    const elements = children.reduce((acc, child) => {
      const size = sizes[paneIndex] ? sizes[paneIndex] : 0;
      let pane;
      const isPane = child.type === Pane;
      const paneProps = {
        index: paneIndex,
        'data-type': 'Pane',
        size: size,
        split: split,
        ratio: ratios[paneIndex],
        key: `Pane-${paneIndex}`,
        ref: `Pane-${paneIndex}`,
        resized: resized,
        useInitial: useInitial,
      };
      if (isPane) {
        log(`clone Pane`);
        pane = cloneElement(child, paneProps);
      } else {
        log(`wrap with Pane`);
        pane = <Pane {...paneProps}>{child}</Pane>;
      }
      paneIndex++;
      if (acc.length === 0) {
        return [...acc, pane];
      } else {
        const resizer = (
          <Resizer
            index={resizerIndex}
            key={`Resizer${resizerIndex}`}
            split={split}
            onMouseDown={this.onMouseDown}
            onTouchStart={this.onTouchStart}
            onTouchEnd={this.onMouseUp}
          />
        );
        resizerIndex++;
        return [...acc, resizer, pane];
      }
    }, []);

    if (split === 'vertical') {
      return (
        <RowStyle
          className={className}
          data-type="SplitPane"
          data-split={split}
          ref={splitPane => (this.splitPane = splitPane)}
        >
          {elements}
        </RowStyle>
      );
    } else {
      return (
        <ColumnStyle
          className={className}
          data-type="SplitPane"
          data-split={split}
          ref={splitPane => (this.splitPane = splitPane)}
        >
          {elements}
        </ColumnStyle>
      );
    }
  }
}

SplitPane.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  className: PropTypes.string,
  split: PropTypes.oneOf(['vertical', 'horizontal']),
};

SplitPane.defaultProps = {
  split: 'vertical',
};

export default SplitPane;
