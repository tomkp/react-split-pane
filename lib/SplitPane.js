'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Pane = require('./Pane');

var _Pane2 = _interopRequireDefault(_Pane);

var _Resizer = require('./Resizer');

var _Resizer2 = _interopRequireDefault(_Resizer);

var _reactVendorPrefix = require('react-vendor-prefix');

var _reactVendorPrefix2 = _interopRequireDefault(_reactVendorPrefix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'SplitPane',


    propTypes: {
        primary: _react2.default.PropTypes.oneOf(['first', 'second']),
        minSize: _react2.default.PropTypes.number,
        defaultSize: _react2.default.PropTypes.number,
        size: _react2.default.PropTypes.number,
        allowResize: _react2.default.PropTypes.bool,
        split: _react2.default.PropTypes.oneOf(['vertical', 'horizontal'])
    },

    getInitialState: function getInitialState() {
        return {
            active: false,
            resized: false
        };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            split: 'vertical',
            minSize: 0,
            allowResize: true,
            primary: 'first'
        };
    },
    componentDidMount: function componentDidMount() {
        this.setSize(this.props, this.state);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
    },
    componentWillReceiveProps: function componentWillReceiveProps(props) {
        this.setSize(props, this.state);
    },
    setSize: function setSize(props, state) {
        var ref = this.props.primary === 'first' ? this.refs.pane1 : this.refs.pane2;
        var newSize = void 0;
        if (ref) {
            newSize = props.size || state && state.draggedSize || props.defaultSize || props.minSize;
            ref.setState({
                size: newSize
            });
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);
    },
    onMouseDown: function onMouseDown(event) {
        if (this.props.allowResize && !this.props.size) {
            this.unFocus();
            var position = this.props.split === 'vertical' ? event.clientX : event.clientY;
            if (this.props.onDragStart) {
                this.props.onDragStart();
            }
            this.setState({
                active: true,
                position: position
            });
        }
    },
    onMouseMove: function onMouseMove(event) {
        if (this.props.allowResize && !this.props.size) {
            if (this.state.active) {
                this.unFocus();
                var ref = this.props.primary === 'first' ? this.refs.pane1 : this.refs.pane2;
                if (ref) {
                    var node = _reactDom2.default.findDOMNode(ref);

                    if (node.getBoundingClientRect) {
                        var width = node.getBoundingClientRect().width;
                        var height = node.getBoundingClientRect().height;
                        var current = this.props.split === 'vertical' ? event.clientX : event.clientY;
                        var size = this.props.split === 'vertical' ? width : height;
                        var position = this.state.position;
                        var newPosition = this.props.primary === 'first' ? position - current : current - position;

                        var newSize = size - newPosition;

                        if (newSize < this.props.minSize) {
                            newSize = this.props.minSize;
                        } else {
                            this.setState({
                                position: current,
                                resized: true
                            });
                        }

                        if (this.props.onChange) {
                            this.props.onChange(newSize);
                        }
                        this.setState({
                            draggedSize: newSize
                        });
                        ref.setState({
                            size: newSize
                        });
                    }
                }
            }
        }
    },
    onMouseUp: function onMouseUp() {
        if (this.props.allowResize && !this.props.size) {
            if (this.state.active) {
                if (this.props.onDragFinished) {
                    this.props.onDragFinished();
                }
                this.setState({
                    active: false
                });
            }
        }
    },
    unFocus: function unFocus() {
        if (document.selection) {
            document.selection.empty();
        } else {
            window.getSelection().removeAllRanges();
        }
    },


    merge: function merge(into, obj) {
        for (var attr in obj) {
            into[attr] = obj[attr];
        }
    },

    render: function render() {
        var _props = this.props;
        var split = _props.split;
        var allowResize = _props.allowResize;

        var disabledClass = allowResize ? '' : 'disabled';

        var style = {
            display: 'flex',
            flex: 1,
            position: 'relative',
            outline: 'none',
            overflow: 'hidden',
            MozUserSelect: 'text',
            WebkitUserSelect: 'text',
            msUserSelect: 'text',
            userSelect: 'text'
        };

        if (split === 'vertical') {
            this.merge(style, {
                flexDirection: 'row',
                height: '100%',
                position: 'absolute',
                left: 0,
                right: 0
            });
        } else {
            this.merge(style, {
                flexDirection: 'column',
                height: '100%',
                minHeight: '100%',
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '100%'
            });
        }

        var children = this.props.children;
        var classes = ['SplitPane', split, disabledClass];
        var prefixed = _reactVendorPrefix2.default.prefix({ styles: style });

        return _react2.default.createElement(
            'div',
            { className: classes.join(' '), style: prefixed.styles, ref: 'splitPane' },
            _react2.default.createElement(
                _Pane2.default,
                { ref: 'pane1', key: 'pane1', split: split },
                children[0]
            ),
            _react2.default.createElement(_Resizer2.default, { ref: 'resizer', key: 'resizer', className: disabledClass, onMouseDown: this.onMouseDown, split: split }),
            _react2.default.createElement(
                _Pane2.default,
                { ref: 'pane2', key: 'pane2', split: split },
                children[1]
            )
        );
    }
});
module.exports = exports['default'];