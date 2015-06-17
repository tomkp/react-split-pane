'use strict';

import React from 'react';


let Resizer = React.createClass({

    handleDown(event) {
        this.props.down(event);
    },

    render() {
        const split = this.props.split;
        const classes = ['Resizer', split];
        return <span className={classes.join(' ')} onMouseDown={this.handleDown} />
    }
});


export default Resizer;
