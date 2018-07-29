'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getUnit = getUnit;
exports.convertSizeToCssValue = convertSizeToCssValue;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _glamorous = require('glamorous');

var _glamorous2 = _interopRequireDefault(_glamorous);

var _Resizer = require('./Resizer');

var _Resizer2 = _interopRequireDefault(_Resizer);

var _Pane = require('./Pane');

var _Pane2 = _interopRequireDefault(_Pane);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_PANE_SIZE = '1';
var DEFAULT_PANE_MIN_SIZE = '0';
var DEFAULT_PANE_MAX_SIZE = '100%';

var ColumnStyle = _glamorous2.default.div({
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  flex: 1,
  outline: 'none',
  overflow: 'hidden',
  userSelect: 'text'
});

var RowStyle = _glamorous2.default.div({
  display: 'flex',
  height: '100%',
  flexDirection: 'row',
  flex: 1,
  outline: 'none',
  overflow: 'hidden',
  userSelect: 'text'
});

function convert(str, size) {
  var tokens = str.match(/([0-9]+)([px|%|vw|vh]*)/);
  var value = tokens[1];
  var unit = tokens[2];
  return toPx(value, unit, size);
}

function toPx(value) {
  var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'px';
  var size = arguments[2];

  switch (unit) {
    case '%':
      {
        return +(size * value / 100).toFixed(2);
      }
    case 'vw':
    case 'vh':
      {
        return +(getViewWidthAndHeight()[unit] * value);
      }
    default:
      {
        return +value;
      }
  }
}

function removeNullChildren(children) {
  return _react2.default.Children.toArray(children).filter(function (c) {
    return c;
  });
}

function getUnit(size) {
  var res = 'ratio';
  ['px', '%', 'vw', 'vh'].forEach(function (unit) {
    if (size.endsWith(unit)) {
      res = unit;
    }
  });
  return res;
}

function convertSizeToCssValue(value, resizersSize) {
  if (getUnit(value) !== '%') {
    return value;
  }

  if (!resizersSize) {
    return value;
  }

  var idx = value.search('%');
  var percent = value.slice(0, idx) / 100;
  if (percent === 0) {
    return value;
  }

  return 'calc(' + value + ' - ' + resizersSize + 'px*' + percent + ')';
}

function getViewWidthAndHeight() {
  var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight || e.clientHeight || g.clientHeight;
  return { vw: x / 100, vh: y / 100 };
}

function convertToUnit(size, unit, containerSize) {
  switch (unit) {
    case '%':
      return (size / containerSize * 100).toFixed(2) + '%';
    case 'px':
      return size.toFixed(2) + 'px';
    case 'ratio':
      return (size * 100).toFixed(0);
    case 'vh':
    case 'vw':
      return '' + (size / getViewWidthAndHeight()[unit]).toFixed(2) + unit;
  }
}

var SplitPane = function (_Component) {
  _inherits(SplitPane, _Component);

  function SplitPane(props) {
    _classCallCheck(this, SplitPane);

    var _this = _possibleConstructorReturn(this, (SplitPane.__proto__ || Object.getPrototypeOf(SplitPane)).call(this, props));

    _this.onMouseDown = function (event, resizerIndex) {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();

      _this.onDown(resizerIndex, event.clientX, event.clientY);
    };

    _this.onTouchStart = function (event, resizerIndex) {
      event.preventDefault();

      var _event$touches$ = event.touches[0],
          clientX = _event$touches$.clientX,
          clientY = _event$touches$.clientY;


      _this.onDown(resizerIndex, clientX, clientY);
    };

    _this.onDown = function (resizerIndex, clientX, clientY) {
      var _this$props = _this.props,
          allowResize = _this$props.allowResize,
          onResizeStart = _this$props.onResizeStart,
          split = _this$props.split;


      if (!allowResize) {
        return;
      }

      _this.resizerIndex = resizerIndex;
      _this.dimensionsSnapshot = _this.getDimensionsSnapshot(_this.props);
      _this.startClientX = clientX;
      _this.startClientY = clientY;

      document.addEventListener('mousemove', _this.onMouseMove);
      document.addEventListener('mouseup', _this.onMouseUp);

      document.addEventListener('touchmove', _this.onTouchMove);
      document.addEventListener('touchend', _this.onMouseUp);
      document.addEventListener('touchcancel', _this.onMouseUp);

      if (onResizeStart) {
        onResizeStart();
      }
    };

    _this.onMouseMove = function (event) {
      event.preventDefault();

      _this.onMove(event.clientX, event.clientY);
    };

    _this.onTouchMove = function (event) {
      event.preventDefault();

      var _event$touches$2 = event.touches[0],
          clientX = _event$touches$2.clientX,
          clientY = _event$touches$2.clientY;


      _this.onMove(clientX, clientY);
    };

    _this.onMouseUp = function (event) {
      event.preventDefault();

      document.removeEventListener('mouseup', _this.onMouseUp);
      document.removeEventListener('mousemove', _this.onMouseMove);

      document.removeEventListener('touchmove', _this.onTouchMove);
      document.removeEventListener('touchend', _this.onMouseUp);
      document.addEventListener('touchcancel', _this.onMouseUp);

      if (_this.props.onResizeEnd) {
        _this.props.onResizeEnd(_this.state.sizes);
      }
    };

    _this.setPaneRef = function (idx, el) {
      if (!_this.paneElements) {
        _this.paneElements = [];
      }

      _this.paneElements[idx] = el;
    };

    _this.state = {
      sizes: _this.getPanePropSize(props)
    };
    return _this;
  }

  _createClass(SplitPane, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({ sizes: this.getPanePropSize(nextProps) });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('mouseup', this.onMouseUp);
      document.removeEventListener('mousemove', this.onMouseMove);

      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('touchend', this.onMouseUp);
    }
  }, {
    key: 'getDimensionsSnapshot',
    value: function getDimensionsSnapshot(props) {
      var split = props.split;
      var paneDimensions = this.getPaneDimensions();
      var splitPaneDimensions = this.splitPane.getBoundingClientRect();
      var minSizes = this.getPanePropMinMaxSize(props, 'minSize');
      var maxSizes = this.getPanePropMinMaxSize(props, 'maxSize');

      var resizersSize = this.getResizersSize(removeNullChildren(this.props.children));
      var splitPaneSizePx = split === 'vertical' ? splitPaneDimensions.width - resizersSize : splitPaneDimensions.height - resizersSize;

      var minSizesPx = minSizes.map(function (s) {
        return convert(s, splitPaneSizePx);
      });
      var maxSizesPx = maxSizes.map(function (s) {
        return convert(s, splitPaneSizePx);
      });
      var sizesPx = paneDimensions.map(function (d) {
        return split === 'vertical' ? d.width : d.height;
      });

      return {
        resizersSize: resizersSize,
        paneDimensions: paneDimensions,
        splitPaneSizePx: splitPaneSizePx,
        minSizesPx: minSizesPx,
        maxSizesPx: maxSizesPx,
        sizesPx: sizesPx
      };
    }
  }, {
    key: 'getPanePropSize',
    value: function getPanePropSize(props) {
      return removeNullChildren(props.children).map(function (child) {
        var value = child.props['size'] || child.props['initialSize'];
        if (value === undefined) {
          return DEFAULT_PANE_SIZE;
        }

        return String(value);
      });
    }
  }, {
    key: 'getPanePropMinMaxSize',
    value: function getPanePropMinMaxSize(props, key) {
      return removeNullChildren(props.children).map(function (child) {
        var value = child.props[key];
        if (value === undefined) {
          return key === 'maxSize' ? DEFAULT_PANE_MAX_SIZE : DEFAULT_PANE_MIN_SIZE;
        }

        return value;
      });
    }
  }, {
    key: 'getPaneDimensions',
    value: function getPaneDimensions() {
      return this.paneElements.filter(function (el) {
        return el;
      }).map(function (el) {
        return el.getBoundingClientRect();
      });
    }
  }, {
    key: 'getSizes',
    value: function getSizes() {
      return this.state.sizes;
    }
  }, {
    key: 'onMove',
    value: function onMove(clientX, clientY) {
      var _props = this.props,
          split = _props.split,
          onChange = _props.onChange;

      var resizerIndex = this.resizerIndex;
      var _dimensionsSnapshot = this.dimensionsSnapshot,
          sizesPx = _dimensionsSnapshot.sizesPx,
          minSizesPx = _dimensionsSnapshot.minSizesPx,
          maxSizesPx = _dimensionsSnapshot.maxSizesPx,
          splitPaneSizePx = _dimensionsSnapshot.splitPaneSizePx,
          paneDimensions = _dimensionsSnapshot.paneDimensions;


      var sizeDim = split === 'vertical' ? 'width' : 'height';
      var primary = paneDimensions[resizerIndex];
      var secondary = paneDimensions[resizerIndex + 1];
      var maxSize = primary[sizeDim] + secondary[sizeDim];

      var primaryMinSizePx = minSizesPx[resizerIndex];
      var secondaryMinSizePx = minSizesPx[resizerIndex + 1];
      var primaryMaxSizePx = Math.min(maxSizesPx[resizerIndex], maxSize);
      var secondaryMaxSizePx = Math.min(maxSizesPx[resizerIndex + 1], maxSize);

      var moveOffset = split === 'vertical' ? this.startClientX - clientX : this.startClientY - clientY;

      var primarySizePx = primary[sizeDim] - moveOffset;
      var secondarySizePx = secondary[sizeDim] + moveOffset;

      var primaryHasReachedLimit = false;
      var secondaryHasReachedLimit = false;

      if (primarySizePx < primaryMinSizePx) {
        primarySizePx = primaryMinSizePx;
        primaryHasReachedLimit = true;
      } else if (primarySizePx > primaryMaxSizePx) {
        primarySizePx = primaryMaxSizePx;
        primaryHasReachedLimit = true;
      }

      if (secondarySizePx < secondaryMinSizePx) {
        secondarySizePx = secondaryMinSizePx;
        secondaryHasReachedLimit = true;
      } else if (secondarySizePx > secondaryMaxSizePx) {
        secondarySizePx = secondaryMaxSizePx;
        secondaryHasReachedLimit = true;
      }

      if (primaryHasReachedLimit) {
        secondarySizePx = primary[sizeDim] + secondary[sizeDim] - primarySizePx;
      } else if (secondaryHasReachedLimit) {
        primarySizePx = primary[sizeDim] + primary[sizeDim] - secondarySizePx;
      }

      sizesPx[resizerIndex] = primarySizePx;
      sizesPx[resizerIndex + 1] = secondarySizePx;

      var sizes = this.getSizes().concat();
      var updateRatio = void 0;

      [primarySizePx, secondarySizePx].forEach(function (paneSize, idx) {
        var unit = getUnit(sizes[resizerIndex + idx]);
        if (unit !== 'ratio') {
          sizes[resizerIndex + idx] = convertToUnit(paneSize, unit, splitPaneSizePx);
        } else {
          updateRatio = true;
        }
      });

      if (updateRatio) {
        var ratioCount = 0;
        var lastRatioIdx = void 0;
        sizes = sizes.map(function (size, idx) {
          if (getUnit(size) === 'ratio') {
            ratioCount++;
            lastRatioIdx = idx;

            return convertToUnit(sizesPx[idx], 'ratio');
          }

          return size;
        });

        if (ratioCount === 1) {
          sizes[lastRatioIdx] = '1';
        }
      }

      onChange && onChange(sizes);

      this.setState({
        sizes: sizes
      });
    }
  }, {
    key: 'getResizersSize',
    value: function getResizersSize(children) {
      return (children.length - 1) * this.props.resizerSize;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          children = _props2.children,
          className = _props2.className,
          split = _props2.split;

      var notNullChildren = removeNullChildren(this.props.children);
      var sizes = this.getSizes();
      var resizersSize = this.getResizersSize(notNullChildren);

      var elements = notNullChildren.reduce(function (acc, child, idx) {
        var pane = void 0;
        var resizerIndex = idx - 1;
        var isPane = child.type === _Pane2.default;
        var paneProps = {
          index: idx,
          'data-type': 'Pane',
          split: split,
          key: 'Pane-' + idx,
          innerRef: _this2.setPaneRef,
          resizersSize: resizersSize,
          size: sizes[idx]
        };

        if (isPane) {
          pane = (0, _react.cloneElement)(child, paneProps);
        } else {
          pane = _react2.default.createElement(
            _Pane2.default,
            paneProps,
            child
          );
        }

        if (acc.length === 0) {
          return [].concat(_toConsumableArray(acc), [pane]);
        } else {
          var resizer = _react2.default.createElement(_Resizer2.default, {
            index: resizerIndex,
            key: 'Resizer-' + resizerIndex,
            split: split,
            onMouseDown: _this2.onMouseDown,
            onTouchStart: _this2.onTouchStart
          });

          return [].concat(_toConsumableArray(acc), [resizer, pane]);
        }
      }, []);

      var StyleComponent = split === 'vertical' ? RowStyle : ColumnStyle;

      return _react2.default.createElement(
        StyleComponent,
        {
          className: className,
          'data-type': 'SplitPane',
          'data-split': split,
          innerRef: function innerRef(el) {
            _this2.splitPane = el;
          }
        },
        elements
      );
    }
  }]);

  return SplitPane;
}(_react.Component);

SplitPane.propTypes = {
  children: _propTypes2.default.arrayOf(_propTypes2.default.node).isRequired,
  className: _propTypes2.default.string,
  split: _propTypes2.default.oneOf(['vertical', 'horizontal']),
  resizerSize: _propTypes2.default.number,
  onChange: _propTypes2.default.func,
  onResizeStart: _propTypes2.default.func,
  onResizeEnd: _propTypes2.default.func
};

SplitPane.defaultProps = {
  split: 'vertical',
  resizerSize: 1,
  allowResize: true
};

exports.default = SplitPane;