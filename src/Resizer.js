'use strict';

import React from 'react';


export default React.createClass({

    onMouseDown(event) {
        this.props.onMouseDown(event);
    },

    render() {
        const {split, className} = this.props;
        const classes = ['Resizer', split, className];
        return (<span className={classes.join(' ')} onMouseDown={this.onMouseDown} />);
    }
});


