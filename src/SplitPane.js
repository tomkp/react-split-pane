'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Pane from './Pane';
import Resizer from './Resizer';
import VendorPrefix from 'react-vendor-prefix';


export default React.createClass({


    getInitialState() {
        return {
            active: false,
            resized: false
        };
    },


    getDefaultProps() {
        return {
            minSize: 0
        };
    },


    componentDidMount() {
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
        const ref = this.refs.pane1;
        if (ref && this.props.defaultSize && !this.state.resized) {
            ref.setState({
                size: this.props.defaultSize
            });
        }
    },


    componentWillUnmount() {
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);
    },


    onMouseDown(event) {
        let position = this.props.split === 'vertical' ? event.clientX : event.clientY;
        this.setState({
            active: true,
            position: position
        });
    },


    onMouseMove(event) {
        if (this.state.active) {
            const ref = this.refs.pane1;
            if (ref) {
                const node = ReactDOM.findDOMNode(ref);
                if (window.getComputedStyle) {
                    const styles = window.getComputedStyle(node);
                    const width = styles.width.replace('px', '');
                    const height = styles.height.replace('px', '');
                    const current = this.props.split === 'vertical' ? event.clientX : event.clientY;
                    const size = this.props.split === 'vertical' ? width : height;
                    const position = this.state.position;

                    const newSize = size - (position - current);
                    this.setState({
                        position: current,
                        resized: true
                    });

                    if (newSize >= this.props.minSize) {
                        if (this.props.onChange) {
                          this.props.onChange(newSize);
                        }
                        ref.setState({
                            size: newSize
                        });
                    }
                }
            }
        }
    },


    onMouseUp() {
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

        const split = this.props.split || 'vertical';

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

        const children = this.props.children;
        const classes = ['SplitPane', split];
        const prefixed = VendorPrefix.prefix({styles: style});

        return (
            <div className={classes.join(' ')} style={prefixed.styles} ref="splitPane">
                <Pane ref="pane1" key="pane1" split={split}>{children[0]}</Pane>
                <Resizer ref="resizer" key="resizer" onMouseDown={this.onMouseDown} split={split} />
                <Pane ref="pane2" key="pane2" split={split}>{children[1]}</Pane>
            </div>
        );
    }
});
