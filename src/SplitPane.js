import React, { Component, PropTypes } from 'react';
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

class SplitPane extends Component {
    constructor(...args) {
        super(...args);

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
        if (this.props.allowResize) {
            unFocus(document, window);
            const position = this.props.split === 'vertical' ? event.touches[0].clientX : event.touches[0].clientY;
            if (typeof this.props.onDragStarted === 'function') {
                this.props.onDragStarted();
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
        if (this.props.allowResize) {
            if (this.state.active) {
                unFocus(document, window);
                const isPrimaryFirst = this.props.primary === 'first';
                const ref = isPrimaryFirst ? this.pane1 : this.pane2;
                if (ref) {
                    const node = ReactDOM.findDOMNode(ref);

                    if (node.getBoundingClientRect) {
                        const width = node.getBoundingClientRect().width;
                        const height = node.getBoundingClientRect().height;
                        const current = this.props.split === 'vertical'
                            ? event.touches[0].clientX
                            : event.touches[0].clientY;
                        const size = this.props.split === 'vertical'
                            ? width
                            : height;
                        const position = this.state.position;
                        const newPosition = isPrimaryFirst ? (position - current) : (current - position);

                        let maxSize = this.props.maxSize;
                        if ((this.props.maxSize !== undefined) && (this.props.maxSize <= 0)) {
                            const splPane = this.splitPane;
                            if (this.props.split === 'vertical') {
                                maxSize = splPane.getBoundingClientRect().width + this.props.maxSize;
                            } else {
                                maxSize = splPane.getBoundingClientRect().height + this.props.maxSize;
                            }
                        }

                        let newSize = size - newPosition;

                        if (newSize < this.props.minSize) {
                            newSize = this.props.minSize;
                        } else if ((this.props.maxSize !== undefined) && (newSize > maxSize)) {
                            newSize = maxSize;
                        } else {
                            this.setState({
                                position: current,
                                resized: true,
                            });
                        }

                        if (this.props.onChange) {
                            this.props.onChange(newSize);
                        }
                        this.setState({
                            draggedSize: newSize,
                        });
                        ref.setState({
                            size: newSize,
                        });
                    }
                }
            }
        }
    }

    onMouseUp() {
        if (this.props.allowResize) {
            if (this.state.active) {
                if (typeof this.props.onDragFinished === 'function') {
                    this.props.onDragFinished(this.state.draggedSize);
                }
                this.setState({
                    active: false,
                });
            }
        }
    }

    setSize(props, state) {
        const ref = this.props.primary === 'first' ? this.pane1 : this.pane2;
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
        const { split, allowResize } = this.props;
        const disabledClass = allowResize ? '' : 'disabled';

        const style = Object.assign({},
            this.props.style || {}, {
                display: 'flex',
                flex: 1,
                position: 'relative',
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
                height: '100%',
                position: 'absolute',
                left: 0,
                right: 0,
            });
        } else {
            Object.assign(style, {
                flexDirection: 'column',
                height: '100%',
                minHeight: '100%',
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '100%',
            });
        }

        const children = this.props.children;
        const classes = ['SplitPane', this.props.className, split, disabledClass];

        const pane1Style = this.props.prefixer.prefix(
            Object.assign({},
            this.props.paneStyle || {},
            this.props.pane1Style || {}),
        );

        const pane2Style = this.props.prefixer.prefix(
            Object.assign({},
            this.props.paneStyle || {},
            this.props.pane2Style || {}),
        );

        return (
            <div
                className={classes.join(' ')}
                style={this.props.prefixer.prefix(style)}
                ref={(node) => { this.splitPane = node; }}
            >

                <Pane
                    ref={(node) => { this.pane1 = node; }}
                    key="pane1" className="Pane1"
                    style={pane1Style}
                    split={split}
                    size={this.props.primary === 'first' ?
                      this.props.size || this.props.defaultSize || this.props.minSize :
                      undefined
                    }
                >
                    {children[0]}
                </Pane>
                <Resizer
                    ref={(node) => { this.resizer = node; }}
                    key="resizer"
                    className={disabledClass}
                    resizerClassName={this.props.resizerClassName}
                    onMouseDown={this.onMouseDown}
                    onTouchStart={this.onTouchStart}
                    onTouchEnd={this.onMouseUp}
                    style={this.props.resizerStyle || {}}
                    split={split}
                />
                <Pane
                    ref={(node) => { this.pane2 = node; }}
                    key="pane2"
                    className="Pane2"
                    style={pane2Style}
                    split={split}
                    size={this.props.primary === 'second' ?
                      this.props.size || this.props.defaultSize || this.props.minSize :
                      undefined
                    }
                >
                    {children[1]}
                </Pane>
            </div>
        );
    }
}

SplitPane.propTypes = {
    primary: PropTypes.oneOf(['first', 'second']),
    minSize: PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]),
    maxSize: PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]),
    // eslint-disable-next-line react/no-unused-prop-types
    defaultSize: PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]),
    size: PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]),
    allowResize: PropTypes.bool,
    split: PropTypes.oneOf(['vertical', 'horizontal']),
    onDragStarted: PropTypes.func,
    onDragFinished: PropTypes.func,
    onChange: PropTypes.func,
    prefixer: PropTypes.instanceOf(Prefixer).isRequired,
    style: stylePropType,
    resizerStyle: stylePropType,
    paneStyle: stylePropType,
    pane1Style: stylePropType,
    pane2Style: stylePropType,
    className: PropTypes.string,
    resizerClassName: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

SplitPane.defaultProps = {
    split: 'vertical',
    minSize: 50,
    allowResize: true,
    prefixer: new Prefixer({ userAgent: USER_AGENT }),
    primary: 'first',
};

export default SplitPane;
