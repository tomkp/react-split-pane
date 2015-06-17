'use strict';

import React from 'react';
import Pane from './Pane';
import Resizer from './Resizer';
import VendorPrefix from 'react-vendor-prefix';


let SplitPane = React.createClass({


    propTypes: {
        minSize: React.PropTypes.number,
        split: React.PropTypes.string
    },

    getInitialState() {
        return {
            active: false
        };
    },

    getDefaultProps() {
        return {
            minSize: 0
        };
    },

    componentDidMount() {
        document.addEventListener('mouseup', this.up);
        document.addEventListener('mousemove', this.move);
    },


    componentWillUnmount() {
        document.removeEventListener('mouseup', this.up);
        document.removeEventListener('mousemove', this.move);
    },


    down(event) {
        let position = this.props.split === 'vertical' ? event.clientX : event.clientY;
        this.setState({
            active: true,
            position: position
        });
    },


    move(event) {
        if (this.state.active) {
            const ref = this.refs.pane1;
            if (ref) {
                const node = ref.getDOMNode();
                if (window.getComputedStyle) {
                    const styles = window.getComputedStyle(node);
                    const width = styles.width.replace('px', '');
                    const height = styles.height.replace('px', '');
                    const current = this.props.split === 'vertical' ? event.clientX : event.clientY;
                    const size = this.props.split === 'vertical' ? width : height;
                    const position = this.state.position;
                    const newSize = size - (position - current);
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
        for (let attr in obj) {
            into[attr] = obj[attr];
        }
    },


    render() {
        const split = this.props.split || 'horizontal';

        let style = {
            display: 'flex',
            flex: 1,
            position: 'relative',
            outline: 'none',
            overflow: 'hidden',
            userSelect: 'none'
        };

        if (split === 'horizontal') {
            this.merge(style, {
                flexDirection: 'column',
                height: '100%',
                minHeight: '100%',
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '100%'
            });
        } else {
            this.merge(style, {
                flexDirection: 'row',
                height: '100%',
                position: 'absolute',
                left: 0,
                right: 0
            });
        }

        let elements = [];
        let children = this.props.children;
        const child0 = children[0];
        const child1 = children[1];
        elements.push(<Pane ref="pane1" key="pane1" split={split}>{child0}</Pane>);
        elements.push(<Resizer ref="resizer" key="resizer" down={this.down} split={split} />);
        elements.push(<Pane ref="pane2" key="pane2" split={split}>{child1}</Pane>);

        const classes = ['SplitPane', split];

        const prefixed = VendorPrefix.prefix({styles: style});


        return <div className={classes.join(' ')} style={prefixed.styles} ref="splitPane">{elements}</div>
    }
});


export default SplitPane;
