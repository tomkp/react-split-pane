'use strict';

import React from 'react';


let Resizer = React.createClass({

    onMouseDown(event) {
        this.props.onMouseDown(event);
    },

    render() {
        const split = this.props.split;
        const classes = ['Resizer', split];
        return <span className={classes.join(' ')} onMouseDown={this.onMouseDown} />
    }
});


export default Resizer;
