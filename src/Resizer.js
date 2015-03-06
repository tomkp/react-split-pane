import React from 'react';


let Resizer = React.createClass({

    handleDown() {
        this.props.down();
    },

    render() {
        return <span className="Resizer" onMouseDown={this.handleDown} />
    }
});


module.exports = Resizer;