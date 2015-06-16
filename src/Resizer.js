'use strict';

import 'core-js/shim';
import React from 'react';


let Resizer = React.createClass({

    handleDown(event) {
        this.props.down(event);
    },

    render() {
        const orientation = this.props.orientation;
        const classes = ['Resizer', orientation];
        return <span className={classes.join(' ')} onMouseDown={this.handleDown} />
    }
});


export default Resizer;
