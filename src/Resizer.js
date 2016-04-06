import React, { Component, PropTypes } from 'react';


class Resizer extends Component {
    constructor(...args) {
        super(...args);

        this.onMouseDown = this.onMouseDown.bind(this);
    }

    onMouseDown(event) {
        this.props.onMouseDown(event);
    }

    render() {
        const { split, className, children } = this.props;
        const classes = ['Resizer', split, className];

        const style = {};
        if (split === 'vertical') {
            Object.assign(style, {height: '100%'});
        } else {
            Object.assign(style, {width: '100%'});
        }

        return (
            <div style={style} className={classes.join(' ')} onMouseDown={this.onMouseDown}>
              {children}
            </div>
        );
    }
}

Resizer.propTypes = {
    onMouseDown: PropTypes.func.isRequired,
    split: PropTypes.oneOf(['vertical', 'horizontal']),
    className: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default Resizer;
