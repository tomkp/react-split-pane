"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react"));

var Pane = _interopRequire(require("./Pane"));

var Resizer = _interopRequire(require("./Resizer"));

var prefix = _interopRequire(require("./Prefix"));

var SplitPane = React.createClass({
    displayName: "SplitPane",

    getInitialState: function getInitialState() {
        return {
            active: false
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

    down: function down() {
        var position = this.props.orientation === "horizontal" ? event.clientX : event.clientY;
        this.setState({
            active: true,
            position: position
        });
    },

    move: function move() {
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
        var orientation = this.props.orientation;

        var definition = {
            display: "flex",
            flex: 1,
            position: "relative",
            outline: "none",
            overflow: "hidden",
            userSelect: "none"
        };

        if (orientation === "vertical") {
            this.merge(definition, {
                flexDirection: "column",
                height: "100%",
                minHeight: "100%",
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "100%"
            });
        } else {
            this.merge(definition, {
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

        return React.createElement(
            "div",
            { className: classes.join(" "), style: prefix(definition), ref: "splitPane" },
            elements
        );
    }
});

module.exports = SplitPane;
