'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _static = require('inline-style-prefixer/static');

var _static2 = _interopRequireDefault(_static);

var _SplitPane = require('./SplitPane');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function PaneStyle(_ref) {
  var split = _ref.split,
      initialSize = _ref.initialSize,
      size = _ref.size,
      minSize = _ref.minSize,
      maxSize = _ref.maxSize,
      resizersSize = _ref.resizersSize;

  var value = size || initialSize;
  var vertical = split === 'vertical';
  var styleProp = {
    minSize: vertical ? 'minWidth' : 'minHeight',
    maxSize: vertical ? 'maxWidth' : 'maxHeight',
    size: vertical ? 'width' : 'height'
  };

  var style = {
    display: 'flex',
    outline: 'none'
  };

  style[styleProp.minSize] = (0, _SplitPane.convertSizeToCssValue)(minSize, resizersSize);
  style[styleProp.maxSize] = (0, _SplitPane.convertSizeToCssValue)(maxSize, resizersSize);

  switch ((0, _SplitPane.getUnit)(value)) {
    case 'ratio':
      style.flex = value;
      break;
    case '%':
    case 'px':
    case 'vw':
    case 'vh':
      style.flexGrow = 0;
      style[styleProp.size] = (0, _SplitPane.convertSizeToCssValue)(value, resizersSize);
      break;
  }

  return style;
}

var Pane = function (_PureComponent) {
  _inherits(Pane, _PureComponent);

  function Pane() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, Pane);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = Pane.__proto__ || Object.getPrototypeOf(Pane)).call.apply(_ref2, [this].concat(args))), _this), _this.setRef = function (element) {
      _this.props.innerRef(_this.props.index, element);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Pane, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          className = _props.className;

      var prefixedStyle = (0, _static2.default)(PaneStyle(this.props));

      return _react2.default.createElement(
        'div',
        { className: className, style: prefixedStyle, ref: this.setRef },
        children
      );
    }
  }]);

  return Pane;
}(_react.PureComponent);

Pane.propTypes = {
  children: _propTypes2.default.node,
  innerRef: _propTypes2.default.func,
  index: _propTypes2.default.number,
  className: _propTypes2.default.string,
  initialSize: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  minSize: _propTypes2.default.string,
  maxSize: _propTypes2.default.string
};

Pane.defaultProps = {
  initialSize: '1',
  split: 'vertical',
  minSize: '0',
  maxSize: '100%'
};

exports.default = Pane;
module.exports = exports['default'];