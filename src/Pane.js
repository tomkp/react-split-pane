import React from 'react';
import PropTypes from 'prop-types';
import Prefixer from 'inline-style-prefixer';
import stylePropType from 'react-style-proptype';

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.2 (KHTML, like Gecko) Safari/537.2';
const USER_AGENT = typeof navigator !== 'undefined' ? navigator.userAgent : DEFAULT_USER_AGENT;

class Pane extends React.Component {
    constructor(props) {
        super(props);

        this.state = { size: this.props.size };
    }

    render() {
        const { children, className, prefixer, split, style: styleProps } = this.props;
        const { size } = this.state;
        const classes = ['Pane', split, className];

        const style = Object.assign({}, styleProps || {}, {
            flex: 1,
            position: 'relative',
            outline: 'none',
        });

        if (size !== undefined) {
            if (split === 'vertical') {
                style.width = size;
            } else {
                style.height = size;
                style.display = 'flex';
            }
            style.flex = 'none';
        }

        return <div className={classes.join(' ')} style={prefixer.prefix(style)}>{children}</div>;
    }
}

Pane.propTypes = {
    className: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    prefixer: PropTypes.instanceOf(Prefixer).isRequired,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    split: PropTypes.oneOf(['vertical', 'horizontal']),
    style: stylePropType,
};

Pane.defaultProps = {
    prefixer: new Prefixer({ userAgent: USER_AGENT }),
};

export default Pane;
