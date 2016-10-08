import React, { Component, PropTypes } from 'react';
import prefix from 'react-prefixer';
import stylePropType from 'react-style-proptype';

class Pane extends Component {
    constructor(...args) {
        super(...args);

        this.state = {};
    }

    render() {
        const split = this.props.split;
        const classes = ['Pane', split, this.props.className];

        const style = Object.assign({}, this.props.style || {}, {
            flex: 1,
            position: 'relative',
            outline: 'none',
        });

        if (this.state.size !== undefined) {
            if (split === 'vertical') {
                style.width = this.state.size;
            } else {
                style.height = this.state.size;
                style.display = 'flex';
            }
            style.flex = 'none';
        }

        return (
            <div className={classes.join(' ')} style={prefix(style)}>{this.props.children}</div>
        );
    }
}

Pane.propTypes = {
    split: PropTypes.oneOf(['vertical', 'horizontal']),
    className: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    style: stylePropType,
};

export default Pane;
