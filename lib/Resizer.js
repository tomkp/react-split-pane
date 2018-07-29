'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  background: #000;\n  opacity: 0.2;\n  z-index: 1;\n  box-sizing: border-box;\n  background-clip: padding-box;\n\n  :hover {\n    transition: all 2s ease;\n  }\n'], ['\n  background: #000;\n  opacity: 0.2;\n  z-index: 1;\n  box-sizing: border-box;\n  background-clip: padding-box;\n\n  :hover {\n    transition: all 2s ease;\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  height: 11px;\n  margin: -5px 0;\n  border-top: 5px solid rgba(255, 255, 255, 0);\n  border-bottom: 5px solid rgba(255, 255, 255, 0);\n  cursor: row-resize;\n  width: 100%;\n\n  :hover {\n    border-top: 5px solid rgba(0, 0, 0, 0.5);\n    border-bottom: 5px solid rgba(0, 0, 0, 0.5);\n  }\n\n  .disabled {\n    cursor: not-allowed;\n  }\n  .disabled:hover {\n    border-color: transparent;\n  }\n'], ['\n  height: 11px;\n  margin: -5px 0;\n  border-top: 5px solid rgba(255, 255, 255, 0);\n  border-bottom: 5px solid rgba(255, 255, 255, 0);\n  cursor: row-resize;\n  width: 100%;\n\n  :hover {\n    border-top: 5px solid rgba(0, 0, 0, 0.5);\n    border-bottom: 5px solid rgba(0, 0, 0, 0.5);\n  }\n\n  .disabled {\n    cursor: not-allowed;\n  }\n  .disabled:hover {\n    border-color: transparent;\n  }\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  width: 11px;\n  margin: 0 -5px;\n  border-left: 5px solid rgba(255, 255, 255, 0);\n  border-right: 5px solid rgba(255, 255, 255, 0);\n  cursor: col-resize;\n\n  :hover {\n    border-left: 5px solid rgba(0, 0, 0, 0.5);\n    border-right: 5px solid rgba(0, 0, 0, 0.5);\n  }\n  .disabled {\n    cursor: not-allowed;\n  }\n  .disabled:hover {\n    border-color: transparent;\n  }\n'], ['\n  width: 11px;\n  margin: 0 -5px;\n  border-left: 5px solid rgba(255, 255, 255, 0);\n  border-right: 5px solid rgba(255, 255, 255, 0);\n  cursor: col-resize;\n\n  :hover {\n    border-left: 5px solid rgba(0, 0, 0, 0.5);\n    border-right: 5px solid rgba(0, 0, 0, 0.5);\n  }\n  .disabled {\n    cursor: not-allowed;\n  }\n  .disabled:hover {\n    border-color: transparent;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Wrapper = _styledComponents2.default.div(_templateObject);

var HorizontalWrapper = (0, _styledComponents2.default)(Wrapper)(_templateObject2);

var VerticalWrapper = (0, _styledComponents2.default)(Wrapper)(_templateObject3);

var Resizer = function (_Component) {
  _inherits(Resizer, _Component);

  function Resizer() {
    _classCallCheck(this, Resizer);

    return _possibleConstructorReturn(this, (Resizer.__proto__ || Object.getPrototypeOf(Resizer)).apply(this, arguments));
  }

  _createClass(Resizer, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          index = _props.index,
          _props$split = _props.split,
          split = _props$split === undefined ? 'vertical' : _props$split,
          _props$onClick = _props.onClick,
          _onClick = _props$onClick === undefined ? function () {} : _props$onClick,
          _props$onDoubleClick = _props.onDoubleClick,
          _onDoubleClick = _props$onDoubleClick === undefined ? function () {} : _props$onDoubleClick,
          _props$onMouseDown = _props.onMouseDown,
          _onMouseDown = _props$onMouseDown === undefined ? function () {} : _props$onMouseDown,
          _props$onTouchEnd = _props.onTouchEnd,
          _onTouchEnd = _props$onTouchEnd === undefined ? function () {} : _props$onTouchEnd,
          _props$onTouchStart = _props.onTouchStart,
          _onTouchStart = _props$onTouchStart === undefined ? function () {} : _props$onTouchStart;

      var props = {
        ref: function ref(_) {
          return _this2.resizer = _;
        },
        'data-attribute': split,
        'data-type': 'Resizer',
        onMouseDown: function onMouseDown(event) {
          return _onMouseDown(event, index);
        },
        onTouchStart: function onTouchStart(event) {
          event.preventDefault();
          _onTouchStart(event, index);
        },
        onTouchEnd: function onTouchEnd(event) {
          event.preventDefault();
          _onTouchEnd(event, index);
        },
        onClick: function onClick(event) {
          if (_onClick) {
            event.preventDefault();
            _onClick(event, index);
          }
        },
        onDoubleClick: function onDoubleClick(event) {
          if (_onDoubleClick) {
            event.preventDefault();
            _onDoubleClick(event, index);
          }
        }
      };

      return split === 'vertical' ? _react2.default.createElement(VerticalWrapper, props) : _react2.default.createElement(HorizontalWrapper, props);
    }
  }]);

  return Resizer;
}(_react.Component);

exports.default = Resizer;
module.exports = exports['default'];