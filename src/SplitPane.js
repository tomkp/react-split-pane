'use strict';

import React from 'react';
import Pane from './Pane';
import Resizer from './Resizer';
import prefix from '../prefix/Prefix';


let SplitPane = React.createClass({


    getInitialState() {
        return {
            active: false
        }
    },


    componentDidMount() {
        document.addEventListener('mouseup', this.up);
        document.addEventListener('mousemove', this.move);
    },


    componentWillUnmount() {
        document.removeEventListener('mouseup', this.up);
        document.removeEventListener('mousemove', this.move);
    },


    down() {
        let position = this.props.orientation === 'horizontal' ? event.clientX : event.clientY;
        this.setState({
            active: true,
            position: position
        });
    },


    move() {
        if (this.state.active) {
            let ref = this.refs.pane1;
            if (ref) {
                let node = ref.getDOMNode();
                if (window.getComputedStyle) {
                    let styles = window.getComputedStyle(node);
                    let width = styles.width.replace('px', '');
                    let height = styles.height.replace('px', '');
                    let current = this.props.orientation === 'horizontal' ? event.clientX : event.clientY;
                    let size = this.props.orientation === 'horizontal' ? width : height;
                    let position = this.state.position;
                    let newSize = size - (position - current);
                    this.setState({
                        position: current
                    });
                    if (newSize >= this.props.minSize) {
                        ref.setState({
                            size: newSize
                        });
                    }
                }
            }
        }
    },


    up() {
        this.setState({
            active: false
        });
    },


    merge: function (into, obj) {
        for (var attr in obj) {
            into[attr] = obj[attr];
        }
    },


    render() {
        let orientation = this.props.orientation;

        let definition = {
            display: 'flex',
            flex: 1,
            position: 'relative',
            outline: 'none',
            overflow: 'hidden',
            userSelect: 'none'
        };

        if (orientation === 'vertical') {
            this.merge(definition, {
                flexDirection: 'column',
                height: '100%',
                minHeight: '100%',
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '100%'
            });
        } else {
            this.merge(definition, {
                flexDirection: 'row',
                height: '100%',
                position: 'absolute',
                left: 0,
                right: 0
            });
        }
        
        let elements = [];
        let children = this.props.children;
        let child0 = children[0];
        let child1 = children[1];
        elements.push(<Pane ref="pane1" key="pane1" orientation={orientation}>{child0}</Pane>);
        elements.push(<Resizer ref="resizer" key="resizer" down={this.down} />);
        elements.push(<Pane ref="pane2" key="pane2" orientation={orientation}>{child1}</Pane>);

        let classes = ['SplitPane', orientation];

        return <div className={classes.join(' ')} style={prefix(definition)} ref="splitPane">{elements}</div>
    }
});


module.exports = SplitPane;