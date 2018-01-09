import React, { Component, cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

import glamorous from 'glamorous';
import Resizer from './Resizer';
import Pane from './Pane';

const debug = false;

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
  //console.log(`paneSize:`, split, dimensions, splitPaneDimensions);
  const sizes = dimensions.map(dimension =>
    (split === 'vertical' ? dimension.width : dimension.height).toFixed(2)
  );

  const ratios = dimensions.map(
    dimension =>
      split === 'vertical'
        ? Math.round
          ((dimension.width / splitPaneDimensions.width).toFixed(4) * 100)
        : Math.round
          ((dimension.height / splitPaneDimensions.height).toFixed(4) * 100)
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

    const minSizes = this.getPaneProp('minSize');
    const maxSizes = this.getPaneProp('maxSize');

    log('min, max sizes', minSizes, maxSizes);
    this.setState({
      minSizes,
      maxSizes
    })
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
      resizerIndex,
    });
  }

  onTouchStart(event, resizerIndex) {
    log(`onTouchStart`, resizerIndex);
    this.onDown();
    this.setState({
      resizerIndex,
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

  getPaneProp(key) {
    const refs = this.refs;
    return Object.keys(refs)
      .filter(ref => ref.startsWith('Pane'))
      .map(ref => refs[ref].props[key]);
  }

  getPaneDimensions() {
    const refs = this.refs;
    return Object.keys(refs)
      .filter(ref => ref.startsWith('Pane'))
      .map(ref => findDOMNode(refs[ref]).getBoundingClientRect());
  }

  getResizerDimensions() {
    const refs = this.refs;
    return Object.keys(refs)
      .filter(ref => ref.startsWith('Resizer'))
      .map(ref => findDOMNode(refs[ref]).getBoundingClientRect());
  }

  onMove(clientX, clientY) {
    const { split, resizerSize } = this.props;
    const { active, dimensions, resizerIndex, minSizes, maxSizes } = this.state;

    if (active) {
      log(`onMove ${clientX},${clientY}`, this.state);
      const node = findDOMNode(this.splitPane);
      const splitPaneDimensions = findDOMNode(node).getBoundingClientRect();
      const resizerDimensions = this.getResizerDimensions()[resizerIndex];

      const primary = dimensions[resizerIndex];
      const secondary = dimensions[resizerIndex + 1];

      if (
        (split === 'vertical' &&
          clientX >= primary.left &&
          clientX <= secondary.right) ||
        (split !== 'vertical' &&
          clientY >= primary.top &&
          clientY <= secondary.bottom)
      ) {
        this.setState(state => {
          let primarySize;
          let secondarySize;
          let splitPaneSize;

          if (split === 'vertical') {

            const resizerLeft = clientX - (resizerSize / 2);
            const resizerRight = clientX + (resizerSize / 2);

            primarySize = resizerLeft - primary.left;
            secondarySize = secondary.right - resizerRight;
            splitPaneSize = splitPaneDimensions.width;
          } else {

            const resizerTop = clientY - (resizerSize / 2);
            const resizerBottom = clientY + (resizerSize / 2);

            primarySize = resizerTop - primary.top;
            secondarySize = secondary.bottom - resizerBottom;
            splitPaneSize = splitPaneDimensions.height;
          }

          const primaryMinSize = convert(minSizes[resizerIndex], splitPaneSize);
          const secondaryMinSize = convert(
            minSizes[resizerIndex + 1],
            splitPaneSize
          );

          const primaryMaxSize = convert(maxSizes[resizerIndex], splitPaneSize);
          const secondaryMaxSize = convert(
            maxSizes[resizerIndex + 1],
            splitPaneSize
          );

          const numResizers = resizerDimensions.length;
          const totalResizerSize = numResizers * resizerSize;

          if (
            primaryMinSize <= primarySize &&
            primaryMaxSize >= primarySize &&
            secondaryMinSize <= secondarySize &&
            secondaryMaxSize >= secondarySize
          ) {
            const primaryRatio = (primarySize / (splitPaneSize - totalResizerSize)).toFixed(4) * 100;
            const secondaryRatio = (secondarySize / (splitPaneSize - totalResizerSize)).toFixed(4) * 100;

            const { ratios, sizes } = state;

            sizes[resizerIndex] = primarySize;
            sizes[resizerIndex + 1] = secondarySize;

            ratios[resizerIndex] = primaryRatio;
            ratios[resizerIndex + 1] = secondaryRatio;

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
            key={`Resizer-${resizerIndex}`}
            ref={`Resizer-${resizerIndex}`}
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
  resizerSize: PropTypes.number,
};

SplitPane.defaultProps = {
  split: 'vertical',
  resizerSize: 1,
};

export default SplitPane;
