import React, { Component, PropTypes } from 'react';


class Resizer extends Component {

    render() {
        const { split, className } = this.props;
        const classes = ['Resizer', split, className];
        return (
            <span
              className={classes.join(' ')}
              style={this.props.style || {}}
              onMouseDown={(event) => {
                this.props.onMouseDown(event);
              }}
              onTouchStart={(event) => {
                event.preventDefault();
                this.props.onTouchStart(event);
              }}
              onTouchEnd={(event) => {
                event.preventDefault();
                this.props.onTouchEnd(event);
              }}
            />
        );
    }
}

Resizer.propTypes = {
  onMouseDown: PropTypes.func.isRequired,
  onTouchStart: PropTypes.func.isRequired,
  onTouchEnd: PropTypes.func.isRequired,
  split: PropTypes.oneOf(['vertical', 'horizontal']),
  className: PropTypes.string.isRequired,
  style: PropTypes.object,
};

export default Resizer;
