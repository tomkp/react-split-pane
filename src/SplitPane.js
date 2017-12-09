import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Prefixer from 'inline-style-prefixer';
import stylePropType from 'react-style-proptype';

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
const controlSnapTypes = {
  STEP: 'STEP',
  SIZE: 'SIZE',
  SIZE_ON_RELEASE: 'SIZE_ON_RELEASE',
};

const setStep = (stepSize) => ({type: controlSnapTypes.STEP, stepSize})
const setSize = (size) => ({type: controlSnapTypes.SIZE, size})
const setSizeOnRelease = (size) => ({type: controlSnapTypes.SIZE_ON_RELEASE, size})

class SplitPane extends React.Component {
  state = {
    active: false,
    // resized: false,
    // startPositionLocal: this.props.defaultSize,
    startPosition: this.props.defaultSize,
    sizeOnRelease: null,
    position: null,
    draggingDelta: null,
    // jumpDirection: null,
  }

  componentDidMount() {
    this.setSize(this.props, this.state);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('touchmove', this.onTouchMove);
  }

  componentWillReceiveProps(props) {
    this.setSize(props, this.state);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('touchmove', this.onTouchMove);
  }

  onMouseDown = (event) => {
    const eventWithTouches = Object.assign({}, event, {
      touches: [{ clientX: event.clientX, clientY: event.clientY }],
    });
    this.onTouchStart(eventWithTouches);
  }

  onTouchStart = (event) => {
    const { allowResize, onDragStarted, split, defaultSize } = this.props;
    const { startPosition, active } = this.state;
    const isVertical = split === 'vertical'

    if (allowResize) {
      unFocus(document, window);
      const position =
        isVertical
          ? event.touches[0].clientX
          : event.touches[0].clientY;

      if (typeof onDragStarted === 'function') {
        onDragStarted();
      }
      
      document.body.style.cursor = isVertical ? 'col-resize' : 'row-resize'

      this.setState({
        active: true,
        position,
        // startPositionLocal: !active && !startPosition && defaultSize > 0 ? defaultSize : startPositionLocal,
        startPosition: !active && !startPosition && defaultSize > 0 ? defaultSize : startPosition,
      });
    }
  }

  onMouseMove = (event) => {
    const eventWithTouches = Object.assign({}, event, {
      touches: [{ clientX: event.clientX, clientY: event.clientY }],
    });
    this.onTouchMove(eventWithTouches);
  }

  onTouchMove = (event) => {
    const { allowResize, maxSize, minSize, onChange, split, step, controlSnap } = this.props;
    const { active, position, startPosition, draggingDelta, jumped } = this.state;

    if (allowResize && active) {
      unFocus(document, window);
      const isPrimaryFirst = this.props.primary === 'first';
      const ref = isPrimaryFirst ? this.pane1 : this.pane2;
      const ref2 = isPrimaryFirst ? this.pane2 : this.pane1;
      if (ref) {
        const node = ReactDOM.findDOMNode(ref);
        const node2 = ReactDOM.findDOMNode(ref2);

        if (node.getBoundingClientRect) {

          // const width = node.getBoundingClientRect().width;
          // const height = node.getBoundingClientRect().height;

          const current =
            split === 'vertical'
              ? event.touches[0].clientX
              : event.touches[0].clientY;

          // const size = split === 'vertical' ? width : height;
          

          let positionDelta = position - current;
          const newPosition = position - positionDelta;

          let newSize = current;

          if(controlSnap) {
            const controlSnapResult = controlSnap({
              jumped,
              current,
              startPosition,
              draggingDelta,
              newPosition,
              setSize,
              setSizeOnRelease,
              setStep,
            });

            this.state.draggingDelta = draggingDelta - positionDelta;            
            
            if(controlSnapResult && controlSnapResult.constructor === Object) {
              if(controlSnapResult.type === controlSnapTypes.STEP){
                // TODO
              }else if(controlSnapResult.type === controlSnapTypes.SIZE_ON_RELEASE){
                  this.state.sizeOnRelease = controlSnapResult.size
              }else if(controlSnapResult.type === controlSnapTypes.SIZE){
                if(controlSnapResult.size !== newSize){
                  newSize = controlSnapResult.size;
                  this.setState({
                    // draggingDelta: 0,
                    jumped: true,
                    startPosition: newSize, 
                    sizeOnRelease: null
                  })
                }
              }
            }
          }

          if (newSize < minSize) {
            newSize = minSize;
          } else if (maxSize !== undefined && newSize > maxSize) {
            newSize = maxSize;
          }          

          if(newPosition !== this.state.position){
            this.setState({
              position: newPosition,
            });
          }

          this.setRealSize(newSize)

        }
      }
    }
  }

  onMouseUp = () => {
    const { allowResize, onDragFinished } = this.props;
    const { active, draggedSize, sizeOnRelease } = this.state;
    if (allowResize && active) {
      if (typeof onDragFinished === 'function') {
        onDragFinished(draggedSize);
      }
      
      document.body.style.cursor = "";

        // debugger
      if(this.state.sizeOnRelease > 0) {
        this.setRealSize(this.state.sizeOnRelease);
      }
      
      this.setState({ 
        active: false, 
        jumped: false,
        draggingDelta: 0,
        // jumpDirection: null,
        // startPosition: this.state.position, 
        sizeOnRelease: null 
      });
    }
  }

  setRealSize = (size) => {
    const { primary, onChange } = this.props;    
    const ref = primary === 'first' ? this.pane1 : this.pane2;
    if (ref) {
      if(this.state.draggedSize !== size){
        if (onChange) onChange(size);
        this.setState({ draggedSize: size });
        ref.setState({ size });                  
      }
    }
  }

  setSize(props, state) {
    const { primary } = this.props;
    const ref = primary === 'first' ? this.pane1 : this.pane2;
    let newSize;
    if (ref) {
      newSize =
        props.size ||
        (state && state.draggedSize) ||
        props.defaultSize ||
        props.minSize;
      ref.setState({
        size: newSize,
      });
      if (props.size !== state.draggedSize) {
        this.setState({
          draggedSize: newSize,
        });
      }
    }
  }

  classNameWithState = (className) => {
    const { active } = this.state;
    if(!active) return ''
    return `${className}--active`
  }

  render() {
    const {
      allowResize,
      children,
      className,
      defaultSize,
      minSize,
      onResizerClick,
      onResizerDoubleClick,
      paneClassName,
      pane1ClassName,
      pane2ClassName,
      paneStyle,
      pane1Style: pane1StyleProps,
      pane2Style: pane2StyleProps,
      primary,
      prefixer,
      resizerClassName,
      resizerStyle,
      size,
      split,
      style: styleProps,
    } = this.props;
    const { active } = this.state;
    const disabledClass = allowResize ? '' : 'disabled';
    const resizerClassNamesIncludingDefault = resizerClassName
      ? `${resizerClassName} ${this.classNameWithState(resizerClassName)} ${RESIZER_DEFAULT_CLASSNAME} ${this.classNameWithState(RESIZER_DEFAULT_CLASSNAME)}`
      : `${RESIZER_DEFAULT_CLASSNAME} ${this.classNameWithState(RESIZER_DEFAULT_CLASSNAME)}`;

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
          ref={node => {
            this.pane1 = node;
          }}
          size={
            primary === 'first' ? size || defaultSize || minSize : undefined
          }
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
          ref={node => {
            this.resizer = node;
          }}
          resizerClassName={resizerClassNamesIncludingDefault}
          split={split}
          style={resizerStyle || {}}
        />
        <Pane
          className={pane2Classes}
          key="pane2"
          ref={node => {
            this.pane2 = node;
          }}
          size={
            primary === 'second' ? size || defaultSize || minSize : undefined
          }
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

export default SplitPane;
