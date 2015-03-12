import React from 'react';


let Resizer = React.createClass({

    handleDown() {
        this.props.down();
    },

    render() {
        let orientation = this.props.orientation;
        let classes = ['Resizer', orientation];
        return <span className={classes.join(' ')} onMouseDown={this.handleDown} />
    }
});


module.exports = Resizer;