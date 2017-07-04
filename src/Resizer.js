import React from 'react';
import PropTypes from 'prop-types';
import Prefixer from 'inline-style-prefixer';
import stylePropType from 'react-style-proptype';

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.2 (KHTML, like Gecko) Safari/537.2';
const USER_AGENT = typeof navigator !== 'undefined' ? navigator.userAgent : DEFAULT_USER_AGENT;
export const RESIZER_DEFAULT_CLASSNAME = 'Resizer';

class Resizer extends React.Component {
    render() {
        const { className, onClick, onDoubleClick, onMouseDown, onTouchEnd, onTouchStart, prefixer, resizerClassName,
            split, style } = this.props;
        const classes = [resizerClassName, split, className];

        return (
            <span
                className={classes.join(' ')}
                style={prefixer.prefix(style) || {}}
                onMouseDown={event => onMouseDown(event)}
                onTouchStart={(event) => {
                    event.preventDefault();
                    onTouchStart(event);
                }}
                onTouchEnd={(event) => {
                    event.preventDefault();
                    onTouchEnd(event);
                }}
                onClick={(event) => {
                    if (onClick) {
                        event.preventDefault();
                        onClick(event);
                    }
                }}
                onDoubleClick={(event) => {
                    if (onDoubleClick) {
                        event.preventDefault();
                        onDoubleClick(event);
                    }
                }}
            />
        );
    }
}

Resizer.propTypes = {
    className: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onMouseDown: PropTypes.func.isRequired,
    onTouchStart: PropTypes.func.isRequired,
    onTouchEnd: PropTypes.func.isRequired,
    prefixer: PropTypes.instanceOf(Prefixer).isRequired,
    split: PropTypes.oneOf(['vertical', 'horizontal']),
    style: stylePropType,
    resizerClassName: PropTypes.string.isRequired,
};

Resizer.defaultProps = {
    prefixer: new Prefixer({ userAgent: USER_AGENT }),
    resizerClassName: RESIZER_DEFAULT_CLASSNAME,
};

export default Resizer;
