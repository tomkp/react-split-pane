import React, { Component, PropTypes } from 'react';
import Prefixer from 'inline-style-prefixer';
import stylePropType from 'react-style-proptype';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.2 (KHTML, like Gecko) Safari/537.2';

class Pane extends Component {
    constructor(...args) {
        super(...args);

        this.state = { size: this.props.size };
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
            <div className={classes.join(' ')} style={this.props.prefixer.prefix(style)}>{this.props.children}</div>
        );
    }
}

Pane.propTypes = {
    split: PropTypes.oneOf(['vertical', 'horizontal']),
    className: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    prefixer: PropTypes.instanceOf(Prefixer).isRequired,
    style: stylePropType,
    size: PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]),
};

Pane.defaultProps = {
    prefixer: new Prefixer({ userAgent: USER_AGENT }),
};

export default Pane;
