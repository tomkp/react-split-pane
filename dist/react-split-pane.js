(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SplitPane = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react"));

var VendorPrefix = _interopRequire(require("react-vendor-prefix"));

var Pane = React.createClass({
    displayName: "Pane",

    getInitialState: function getInitialState() {
        return {};
    },

    render: function render() {
        var orientation = this.props.orientation;
        var classes = ["Pane", orientation];

        var style = {
            flex: 1,
            outline: "none",
            overflow: "auto"
        };
        if (this.state.size) {
            if (orientation === "vertical") {
                style.height = this.state.size;
                style.display = "flex";
            } else {
                style.width = this.state.size;
            }
            style.flex = "none";
        }
        var prefixed = VendorPrefix.prefix({ styles: style });
        return React.createElement(
            "div",
            { className: classes.join(" "), style: prefixed.styles },
            this.props.children
        );
    }
});

module.exports = Pane;

},{"react":undefined,"react-vendor-prefix":undefined}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react"));

var Resizer = React.createClass({
    displayName: "Resizer",

    handleDown: function handleDown(event) {
        this.props.down(event);
    },

    render: function render() {
        var orientation = this.props.orientation;
        var classes = ["Resizer", orientation];
        return React.createElement("span", { className: classes.join(" "), onMouseDown: this.handleDown });
    }
});

module.exports = Resizer;

},{"react":undefined}],3:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react"));

var Pane = _interopRequire(require("./Pane"));

var Resizer = _interopRequire(require("./Resizer"));

var VendorPrefix = _interopRequire(require("react-vendor-prefix"));

var SplitPane = React.createClass({
    displayName: "SplitPane",

    propTypes: {
        minSize: React.PropTypes.number,
        orientation: React.PropTypes.string
    },

    getInitialState: function getInitialState() {
        return {
            active: false
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            minSize: 0
        };
    },

    componentDidMount: function componentDidMount() {
        document.addEventListener("mouseup", this.up);
        document.addEventListener("mousemove", this.move);
    },

    componentWillUnmount: function componentWillUnmount() {
        document.removeEventListener("mouseup", this.up);
        document.removeEventListener("mousemove", this.move);
    },

    down: function down(event) {
        var position = this.props.orientation === "horizontal" ? event.clientX : event.clientY;
        this.setState({
            active: true,
            position: position
        });
    },

    move: function move(event) {
        if (this.state.active) {
            var ref = this.refs.pane1;
            if (ref) {
                var node = ref.getDOMNode();
                if (window.getComputedStyle) {
                    var styles = window.getComputedStyle(node);
                    var width = styles.width.replace("px", "");
                    var height = styles.height.replace("px", "");
                    var current = this.props.orientation === "horizontal" ? event.clientX : event.clientY;
                    var size = this.props.orientation === "horizontal" ? width : height;
                    var position = this.state.position;
                    var newSize = size - (position - current);
                    this.setState({
                        position: current
                    });
                    if (newSize >= this.props.minSize) {
                        ref.setState({
                            size: newSize
                        });
                    }
                }
            }
        }
    },

    up: function up() {
        this.setState({
            active: false
        });
    },

    merge: function merge(into, obj) {
        for (var attr in obj) {
            into[attr] = obj[attr];
        }
    },

    render: function render() {
        var orientation = this.props.orientation || "vertical";

        var style = {
            display: "flex",
            flex: 1,
            position: "relative",
            outline: "none",
            overflow: "hidden",
            userSelect: "none"
        };

        if (orientation === "vertical") {
            this.merge(style, {
                flexDirection: "column",
                height: "100%",
                minHeight: "100%",
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "100%"
            });
        } else {
            this.merge(style, {
                flexDirection: "row",
                height: "100%",
                position: "absolute",
                left: 0,
                right: 0
            });
        }

        var elements = [];
        var children = this.props.children;
        var child0 = children[0];
        var child1 = children[1];
        elements.push(React.createElement(
            Pane,
            { ref: "pane1", key: "pane1", orientation: orientation },
            child0
        ));
        elements.push(React.createElement(Resizer, { ref: "resizer", key: "resizer", down: this.down, orientation: orientation }));
        elements.push(React.createElement(
            Pane,
            { ref: "pane2", key: "pane2", orientation: orientation },
            child1
        ));

        var classes = ["SplitPane", orientation];

        var prefixed = VendorPrefix.prefix({ styles: style });

        return React.createElement(
            "div",
            { className: classes.join(" "), style: prefixed.styles, ref: "splitPane" },
            elements
        );
    }
});

module.exports = SplitPane;

},{"./Pane":1,"./Resizer":2,"react":undefined,"react-vendor-prefix":undefined}]},{},[3])(3)
});