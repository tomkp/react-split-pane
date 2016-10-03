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
        const { split, className } = this.props;
        const classes = ['Resizer', split, className];
        return (
            <span
              className={classes.join(' ')}
              style={this.props.style || {}}
              onMouseDown={this.onMouseDown}
              onTouchStart={(event) => {
                  event.preventDefault();
                  this.props.onTouchStart(event);
              }}
            />
        );
    }
}

Resizer.propTypes = {
    onMouseDown: PropTypes.func.isRequired,
    onTouchStart: PropTypes.func.isRequired,
    split: PropTypes.oneOf(['vertical', 'horizontal']),
    className: PropTypes.string.isRequired,
    style: PropTypes.object,
};

export default Resizer;
