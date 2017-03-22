import React, { Component, PropTypes } from 'react';
import Prefixer from 'inline-style-prefixer';
import stylePropType from 'react-style-proptype';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.2 (KHTML, like Gecko) Safari/537.2';

class Resizer extends Component {

    render() {
        const { split, className, resizerClassName } = this.props;
        const classes = [resizerClassName, split, className];
        return (
            <span
                className={classes.join(' ')}
                style={this.props.prefixer.prefix(this.props.style) || {}}
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
                onClick={(event) => {
                    if (this.props.onClick) {
                        event.preventDefault();
                        this.props.onClick(event);
                    }
                }}
                onDoubleClick={(event) => {
                    if (this.props.onDoubleClick) {
                        event.preventDefault();
                        this.props.onDoubleClick(event);
                    }
                }}
            />
        );
    }
}

Resizer.propTypes = {
    onMouseDown: PropTypes.func.isRequired,
    onTouchStart: PropTypes.func.isRequired,
    onTouchEnd: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    prefixer: PropTypes.instanceOf(Prefixer).isRequired,
    split: PropTypes.oneOf(['vertical', 'horizontal']),
    className: PropTypes.string.isRequired,
    resizerClassName: PropTypes.string.isRequired,
    style: stylePropType,
};

Resizer.defaultProps = {
    prefixer: new Prefixer({ userAgent: USER_AGENT }),
    resizerClassName: 'Resizer',
};

export default Resizer;
