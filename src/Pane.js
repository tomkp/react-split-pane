import React from 'react';
import prefix from '../prefix/Prefix';


let Pane = React.createClass({

    getInitialState() {
        return {
        }
    },

    render() {
        let orientation = this.props.orientation;
        let classes = ['Pane', orientation];

        let styles = {
            flex: 1,
            outline: 'none',
            overflow: 'auto'
        };
        if (this.state.size) {
            if (orientation === 'vertical') {
                styles['height'] = this.state.size;
                styles['display'] = 'flex';
            } else {
                styles['width'] = this.state.size;
                //styles['height'] = '100%';
                //styles['display'] = 'flex';
            }
            styles['flex'] = 'none';
        }
        return <div className={classes.join(' ')} style={prefix(styles)}>{this.props.children}</div>;
    }
});


module.exports = Pane;