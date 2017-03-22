import React from 'react';
import ReactDOM from 'react-dom';
import Prefixer from 'inline-style-prefixer';
import stylePropType from 'react-style-proptype';

import Pane from './Pane';
import Resizer from './Resizer';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.2 (KHTML, like Gecko) Safari/537.2';

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

class SplitPane extends React.Component {
    constructor() {
        super();

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.state = {
            active: false,
            resized: false,
        };
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

    onMouseDown(event) {
        const eventWithTouches = Object.assign(
            {},
            event,
            { touches: [{ clientX: event.clientX, clientY: event.clientY }] },
        );
        this.onTouchStart(eventWithTouches);
    }

    onTouchStart(event) {
        const { allowResize, onDragStarted, split } = this.props;
        if (allowResize) {
            unFocus(document, window);
            const position = split === 'vertical' ? event.touches[0].clientX : event.touches[0].clientY;
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
        const eventWithTouches = Object.assign(
            {},
            event,
            { touches: [{ clientX: event.clientX, clientY: event.clientY }] },
        );
        this.onTouchMove(eventWithTouches);
    }

    onTouchMove(event) {
        const { allowResize, maxSize, minSize, onChange, split } = this.props;
        const { active, position } = this.state;
        if (allowResize && active) {
            unFocus(document, window);
            const isPrimaryFirst = this.props.primary === 'first';
            const ref = isPrimaryFirst ? this.pane1 : this.pane2;
            if (ref) {
                const node = ReactDOM.findDOMNode(ref);

                if (node.getBoundingClientRect) {
                    const width = node.getBoundingClientRect().width;
                    const height = node.getBoundingClientRect().height;
                    const current = split === 'vertical' ? event.touches[0].clientX : event.touches[0].clientY;
                    const size = split === 'vertical' ? width : height;
                    const newPosition = isPrimaryFirst ? (position - current) : (current - position);

                    let newMaxSize = maxSize;
                    if ((maxSize !== undefined) && (maxSize <= 0)) {
                        const splPane = this.splitPane;
                        if (split === 'vertical') {
                            newMaxSize = splPane.getBoundingClientRect().width + maxSize;
                        } else {
                            newMaxSize = splPane.getBoundingClientRect().height + maxSize;
                        }
                    }

                    let newSize = size - newPosition;

                    if (newSize < minSize) {
                        newSize = minSize;
                    } else if ((maxSize !== undefined) && (newSize > newMaxSize)) {
                        newSize = newMaxSize;
                    } else {
                        this.setState({
                            position: current,
                            resized: true,
                        });
                    }

                    if (onChange) onChange(newSize);
                    this.setState({ draggedSize: newSize });
                    ref.setState({ size: newSize });
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

    setSize(props, state) {
        const { primary } = this.props;
        const ref = primary === 'first' ? this.pane1 : this.pane2;
        let newSize;
        if (ref) {
            newSize = props.size || (state && state.draggedSize) || props.defaultSize || props.minSize;
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

    render() {
        const { allowResize, children, className, defaultSize, minSize, onResizerClick, onResizerDoubleClick, paneStyle,
            pane1Style: pane1StyleProps, pane2Style: pane2StyleProps, primary, prefixer, resizerClassName,
            resizerStyle, size, split, style: styleProps } = this.props;
        const disabledClass = allowResize ? '' : 'disabled';

        const style = Object.assign({},
            styleProps || {}, {
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
            });

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
        const pane1Style = prefixer.prefix(Object.assign({}, paneStyle || {}, pane1StyleProps || {}));
        const pane2Style = prefixer.prefix(Object.assign({}, paneStyle || {}, pane2StyleProps || {}));

        return (
            <div
                className={classes.join(' ')}
                ref={(node) => { this.splitPane = node; }}
                style={prefixer.prefix(style)}
            >
                <Pane
                    className="Pane1"
                    key="pane1"
                    ref={(node) => { this.pane1 = node; }}
                    size={primary === 'first' ? size || defaultSize || minSize : undefined}
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
                    ref={(node) => { this.resizer = node; }}
                    resizerClassName={resizerClassName}
                    split={split}
                    style={resizerStyle || {}}
                />
                <Pane
                    className="Pane2"
                    key="pane2"
                    ref={(node) => { this.pane2 = node; }}
                    size={primary === 'second' ? size || defaultSize || minSize : undefined}
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
    allowResize: React.PropTypes.bool,
    children: React.PropTypes.arrayOf(React.PropTypes.node).isRequired,
    className: React.PropTypes.string,
    primary: React.PropTypes.oneOf(['first', 'second']),
    minSize: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    maxSize: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    // eslint-disable-next-line react/no-unused-prop-types
    defaultSize: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    size: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    split: React.PropTypes.oneOf(['vertical', 'horizontal']),
    onDragStarted: React.PropTypes.func,
    onDragFinished: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onResizerClick: React.PropTypes.func,
    onResizerDoubleClick: React.PropTypes.func,
    prefixer: React.PropTypes.instanceOf(Prefixer).isRequired,
    style: stylePropType,
    resizerStyle: stylePropType,
    paneStyle: stylePropType,
    pane1Style: stylePropType,
    pane2Style: stylePropType,
    resizerClassName: React.PropTypes.string,
};

SplitPane.defaultProps = {
    allowResize: true,
    minSize: 50,
    prefixer: new Prefixer({ userAgent: USER_AGENT }),
    primary: 'first',
    split: 'vertical',
};

export default SplitPane;
