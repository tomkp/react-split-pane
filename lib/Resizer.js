'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'Resizer',
    onMouseDown: function onMouseDown(event) {
        this.props.onMouseDown(event);
    },
    render: function render() {
        var _props = this.props;
        var split = _props.split;
        var className = _props.className;

        var classes = ['Resizer', split, className];
        return _react2.default.createElement('span', { className: classes.join(' '), onMouseDown: this.onMouseDown });
    }
});
module.exports = exports['default'];