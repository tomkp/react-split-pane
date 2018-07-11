import React from 'react';
import PropTypes from 'prop-types';
import Prefixer from 'inline-style-prefixer';
import stylePropType from 'react-style-proptype';
import { polyfill } from 'react-lifecycles-compat';

import Pane from './Pane';
import Resizer, { RESIZER_DEFAULT_CLASSNAME } from './Resizer';

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.2 (KHTML, like Gecko) Safari/537.2';
const USER_AGENT =
  typeof navigator !== 'undefined' ? navigator.userAgent : DEFAULT_USER_AGENT;

function unFocus(document, window) {
  if (document.selection) {
    document.selection.empty();
  } else {
    try {
      window.getSelection().removeAllRanges();
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

function getDefaultSize(defaultSize, minSize, maxSize, draggedSize) {
  if (typeof draggedSize === 'number') {
    const min = typeof minSize === 'number' ? minSize : 0;
    const max =
      typeof maxSize === 'number' && maxSize >= 0 ? maxSize : Infinity;
    return Math.max(min, Math.min(max, draggedSize));
  }
  if (defaultSize !== undefined) {
    return defaultSize;
  }
  return minSize;
}

class SplitPane extends React.Component {
  constructor(props) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    // order of setting panel sizes.
    // 1. size
    // 2. getDefaultSize(defaultSize, minsize, maxSize)

    const { size, defaultSize, minSize, maxSize, primary } = props;

    const initialSize =
      size !== undefined
        ? size
        : getDefaultSize(defaultSize, minSize, maxSize, null);

    this.state = {
      active: false,
      resized: false,
      pane1Size: primary === 'first' ? initialSize : undefined,
      pane2Size: primary === 'second' ? initialSize : undefined,

      // previous props that we need in static methods
      instanceProps: {
        primary,
        size,
        defaultSize,
        minSize,
        maxSize,
      },
    };
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('touchmove', this.onTouchMove);
    this.setState(SplitPane.setSize(this.props, this.state));
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return SplitPane.setSize(nextProps, prevState);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('touchmove', this.onTouchMove);
  }

  onMouseDown(event) {
    const eventWithTouches = Object.assign({}, event, {
      touches: [{ clientX: event.clientX, clientY: event.clientY }],
    });
    this.onTouchStart(eventWithTouches);
  }

  onTouchStart(event) {
    const { allowResize, onDragStarted, split } = this.props;
    if (allowResize) {
      unFocus(document, window);
      const position =
        split === 'vertical'
          ? event.touches[0].clientX
          : event.touches[0].clientY;

      if (typeof onDragStarted === 'function') {
        onDragStarted();
      }
      this.setState({
        active: true,
        position,
      });
    }
  }

  onMouseMove(event) {
    const eventWithTouches = Object.assign({}, event, {
      touches: [{ clientX: event.clientX, clientY: event.clientY }],
    });
    this.onTouchMove(eventWithTouches);
  }

  onTouchMove(event) {
    const { allowResize, maxSize, minSize, onChange, split, step } = this.props;
    const { active, position } = this.state;

    if (allowResize && active) {
      unFocus(document, window);
      const isPrimaryFirst = this.props.primary === 'first';
      const ref = isPrimaryFirst ? this.pane1 : this.pane2;
      const ref2 = isPrimaryFirst ? this.pane2 : this.pane1;
      if (ref) {
        const node = ref;
        const node2 = ref2;

        if (node.getBoundingClientRect) {
          const width = node.getBoundingClientRect().width;
          const height = node.getBoundingClientRect().height;
          const current =
            split === 'vertical'
              ? event.touches[0].clientX
              : event.touches[0].clientY;
          const size = split === 'vertical' ? width : height;
          let positionDelta = position - current;
          if (step) {
            if (Math.abs(positionDelta) < step) {
              return;
            }
            // Integer division
            // eslint-disable-next-line no-bitwise
            positionDelta = ~~(positionDelta / step) * step;
          }
          let sizeDelta = isPrimaryFirst ? positionDelta : -positionDelta;

          const pane1Order = parseInt(window.getComputedStyle(node).order);
          const pane2Order = parseInt(window.getComputedStyle(node2).order);
          if (pane1Order > pane2Order) {
            sizeDelta = -sizeDelta;
          }

          let newMaxSize = maxSize;
          if (maxSize !== undefined && maxSize <= 0) {
            const splitPane = this.splitPane;
            if (split === 'vertical') {
              newMaxSize = splitPane.getBoundingClientRect().width + maxSize;
            } else {
              newMaxSize = splitPane.getBoundingClientRect().height + maxSize;
            }
          }

          let newSize = size - sizeDelta;
          const newPosition = position - positionDelta;

          if (newSize < minSize) {
            newSize = minSize;
          } else if (maxSize !== undefined && newSize > newMaxSize) {
            newSize = newMaxSize;
          } else {
            this.setState({
              position: newPosition,
              resized: true,
            });
          }

          if (onChange) onChange(newSize);

          this.setState({
            draggedSize: newSize,
            [isPrimaryFirst ? 'pane1Size' : 'pane2Size']: newSize,
          });
        }
      }
    }
  }

  onMouseUp() {
    const { allowResize, onDragFinished } = this.props;
    const { active, draggedSize } = this.state;
    if (allowResize && active) {
      if (typeof onDragFinished === 'function') {
        onDragFinished(draggedSize);
      }
      this.setState({ active: false });
    }
  }

  // TODO: find a more elegant way to fix this. memoize calls to setSize?
  // we have to check values since gDSFP is called on every render
  static setSize(props, state) {
    const { instanceProps } = state;
    const newState = {};

    const newSize =
      props.size !== undefined
        ? props.size
        : getDefaultSize(
            props.defaultSize,
            props.minSize,
            props.maxSize,
            state.draggedSize
          );

    const defaultSizeChanged =
      props.defaultSize !== instanceProps.defaultSize ||
      props.minSize !== instanceProps.minSize ||
      props.maxSize !== instanceProps.maxSize;

    const shouldUpdateSize =
      props.size !== undefined
        ? props.size !== instanceProps.size
        : defaultSizeChanged;

    if (
      props.size !== undefined &&
      props.size !== state.draggedSize &&
      shouldUpdateSize
    ) {
      newState.draggedSize = newSize;
    }

    const isPanel1Primary = props.primary === 'first';

    if (shouldUpdateSize || props.primary !== state.instanceProps.primary) {
      newState[isPanel1Primary ? 'pane1Size' : 'pane2Size'] = newSize;
    }

    // unset the size on the non primary panel
    if (props.primary !== state.instanceProps.primary) {
      newState[isPanel1Primary ? 'pane2Size' : 'pane1Size'] = undefined;
    }

    // update the values in instanceProps
    instanceProps.primary = props.primary;
    instanceProps.size = props.size;
    instanceProps.defaultSize = props.defaultSize;
    instanceProps.minSize = props.minSize;
    instanceProps.maxSize = props.maxSize;

    newState.instanceProps = instanceProps;

    return newState;
  }

  render() {
    const {
      allowResize,
      children,
      className,
      onResizerClick,
      onResizerDoubleClick,
      paneClassName,
      pane1ClassName,
      pane2ClassName,
      paneStyle,
      pane1Style: pane1StyleProps,
      pane2Style: pane2StyleProps,
      prefixer,
      resizerClassName,
      resizerStyle,
      split,
      style: styleProps,
    } = this.props;

    const { pane1Size, pane2Size } = this.state;

    const disabledClass = allowResize ? '' : 'disabled';
    const resizerClassNamesIncludingDefault = resizerClassName
      ? `${resizerClassName} ${RESIZER_DEFAULT_CLASSNAME}`
      : resizerClassName;

    const style = Object.assign(
      {},
      {
        display: 'flex',
        flex: 1,
        height: '100%',
        position: 'absolute',
        outline: 'none',
        overflow: 'hidden',
        MozUserSelect: 'text',
        WebkitUserSelect: 'text',
        msUserSelect: 'text',
        userSelect: 'text',
      },
      styleProps || {}
    );

    if (split === 'vertical') {
      Object.assign(style, {
        flexDirection: 'row',
        left: 0,
        right: 0,
      });
    } else {
      Object.assign(style, {
        bottom: 0,
        flexDirection: 'column',
        minHeight: '100%',
        top: 0,
        width: '100%',
      });
    }

    const classes = ['SplitPane', className, split, disabledClass];
    const pane1Style = prefixer.prefix(
      Object.assign({}, paneStyle || {}, pane1StyleProps || {})
    );
    const pane2Style = prefixer.prefix(
      Object.assign({}, paneStyle || {}, pane2StyleProps || {})
    );

    const pane1Classes = ['Pane1', paneClassName, pane1ClassName].join(' ');
    const pane2Classes = ['Pane2', paneClassName, pane2ClassName].join(' ');

    return (
      <div
        className={classes.join(' ')}
        ref={node => {
          this.splitPane = node;
        }}
        style={prefixer.prefix(style)}
      >
        <Pane
          className={pane1Classes}
          key="pane1"
          eleRef={node => {
            this.pane1 = node;
          }}
          size={pane1Size}
          split={split}
          style={pane1Style}
        >
          {children[0]}
        </Pane>
        <Resizer
          className={disabledClass}
          onClick={onResizerClick}
          onDoubleClick={onResizerDoubleClick}
          onMouseDown={this.onMouseDown}
          onTouchStart={this.onTouchStart}
          onTouchEnd={this.onMouseUp}
          key="resizer"
          resizerClassName={resizerClassNamesIncludingDefault}
          split={split}
          style={resizerStyle || {}}
        />
        <Pane
          className={pane2Classes}
          key="pane2"
          eleRef={node => {
            this.pane2 = node;
          }}
          size={pane2Size}
          split={split}
          style={pane2Style}
        >
          {children[1]}
        </Pane>
      </div>
    );
  }
}

SplitPane.propTypes = {
  allowResize: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  className: PropTypes.string,
  primary: PropTypes.oneOf(['first', 'second']),
  minSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // eslint-disable-next-line react/no-unused-prop-types
  defaultSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  split: PropTypes.oneOf(['vertical', 'horizontal']),
  onDragStarted: PropTypes.func,
  onDragFinished: PropTypes.func,
  onChange: PropTypes.func,
  onResizerClick: PropTypes.func,
  onResizerDoubleClick: PropTypes.func,
  prefixer: PropTypes.instanceOf(Prefixer).isRequired,
  style: stylePropType,
  resizerStyle: stylePropType,
  paneClassName: PropTypes.string,
  pane1ClassName: PropTypes.string,
  pane2ClassName: PropTypes.string,
  paneStyle: stylePropType,
  pane1Style: stylePropType,
  pane2Style: stylePropType,
  resizerClassName: PropTypes.string,
  step: PropTypes.number,
};

SplitPane.defaultProps = {
  allowResize: true,
  minSize: 50,
  prefixer: new Prefixer({ userAgent: USER_AGENT }),
  primary: 'first',
  split: 'vertical',
  paneClassName: '',
  pane1ClassName: '',
  pane2ClassName: '',
};

polyfill(SplitPane);

export default SplitPane;
