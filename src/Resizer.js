import React from 'react';
import Prefixer from 'inline-style-prefixer';
import stylePropType from 'react-style-proptype';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.2 (KHTML, like Gecko) Safari/537.2';

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
                // eslint-disable-next-line no-static-element-interactions
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
    className: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func,
    onDoubleClick: React.PropTypes.func,
    onMouseDown: React.PropTypes.func.isRequired,
    onTouchStart: React.PropTypes.func.isRequired,
    onTouchEnd: React.PropTypes.func.isRequired,
    prefixer: React.PropTypes.instanceOf(Prefixer).isRequired,
    split: React.PropTypes.oneOf(['vertical', 'horizontal']),
    style: stylePropType,
    resizerClassName: React.PropTypes.string.isRequired,
};

Resizer.defaultProps = {
    prefixer: new Prefixer({ userAgent: USER_AGENT }),
    resizerClassName: 'Resizer',
};

export default Resizer;
