import React from 'react';


let Resizer = React.createClass({

    handleDown() {
        this.props.down();
    },

    render() {
        const orientation = this.props.orientation;
        const classes = ['Resizer', orientation];
        return <span className={classes.join(' ')} onMouseDown={this.handleDown} />
    }
});


export default Resizer;