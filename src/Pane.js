import React, { Component, PropTypes } from 'react';
import VendorPrefix from 'react-vendor-prefix';


class Pane extends Component {
    constructor(...args) {
        super(...args);

        this.state = {};
    }

    render() {
        const split = this.props.split;
        const classes = ['Pane', split, this.props.className];

        const style = {
            flex: 1,
            position: 'relative',
            outline: 'none',
        };

        if (this.state.size !== undefined) {
            if (split === 'vertical') {
                style.width = this.state.size;
            } else {
                style.height = this.state.size;
                style.display = 'flex';
            }
            style.flex = 'none';
        }
        const prefixed = VendorPrefix.prefix({ styles: style });

        return (
            <div className={classes.join(' ')} style={prefixed.styles}>{this.props.children}</div>
        );
    }
}

Pane.propTypes = {
    split: PropTypes.oneOf(['vertical', 'horizontal']),
    className: PropTypes.string.isRequired,
    children: PropTypes.object.isRequired,
};

export default Pane;
