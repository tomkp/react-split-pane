import React from 'react';


let Pane = React.createClass({

    getInitialState() {
        return {
        }
    },

    render() {
        let classes = ['Pane'];
        let styles = {};
        if (this.state.size) {
            if (this.props.orientation === 'horizontal') {
                styles = {
                    width: this.state.size
                }
            } else {
                styles = {
                    height: this.state.size
                }
            }
            classes.push('noflex');
        }
        classes = classes.join(' ');
        return <div className={classes} style={styles}>{this.props.children}</div>;
    }
});


module.exports = Pane;