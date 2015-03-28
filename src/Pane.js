import React from 'react';
import VendorPrefix from 'react-vendor-prefix';


let Pane = React.createClass({

    getInitialState() {
        return {
        }
    },

    render() {
        let orientation = this.props.orientation;
        let classes = ['Pane', orientation];

        let style = {
            flex: 1,
            outline: 'none',
            overflow: 'auto'
        };
        if (this.state.size) {
            if (orientation === 'vertical') {
                style['height'] = this.state.size;
                style['display'] = 'flex';
            } else {
                style['width'] = this.state.size;
            }
            style['flex'] = 'none';
        }
        let prefixed = VendorPrefix.prefix({styles: style});
        return <div className={classes.join(' ')} style={prefixed.styles}>{this.props.children}</div>;
    }
});


export default Pane;