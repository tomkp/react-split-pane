'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Pane from './Pane';
import Resizer from './Resizer';
import VendorPrefix from 'react-vendor-prefix';


export default React.createClass({

    propTypes: {
        primary: React.PropTypes.oneOf(['first', 'second']),
        split: React.PropTypes.oneOf(['vertical', 'horizontal'])
    },

    getInitialState() {
        return {
            active: false,
            resized: false
        };
    },


    getDefaultProps() {
        return {
            split: 'vertical',
            minSize: 0,
            primary: 'first'
        };
    },


    componentDidMount() {
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
        const ref = this.props.primary === 'first' ? this.refs.pane1 : this.refs.pane2;
        if (ref && this.props.defaultSize !== undefined && !this.state.resized) {
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
        this.unFocus();
        let position = this.props.split === 'vertical' ? event.clientX : event.clientY;
        if (this.props.onDragStart) {
            this.props.onDragStart();
        }
        this.setState({
            active: true,
            position: position
        });
    },


    onMouseMove(event) {
        if (this.state.active) {
            this.unFocus();
            const ref = this.props.primary === 'first' ? this.refs.pane1 : this.refs.pane2;
            if (ref) {
                const node = ReactDOM.findDOMNode(ref);

                if (node.getBoundingClientRect) {
                    const width = node.getBoundingClientRect().width;
                    const height = node.getBoundingClientRect().height;
                    const current = this.props.split === 'vertical' ? event.clientX : event.clientY;
                    const size = this.props.split === 'vertical' ? width : height;
                    const position = this.state.position;
                    const newPosition = this.props.primary === 'first' ? (position - current) : (current - position);

                    let newSize =  size - newPosition;
                    this.setState({
                        position: current,
                        resized: true
                    });

                    if (newSize < this.props.minSize) {
                        newSize = this.props.minSize;
                    }
                    
                    if (this.props.onChange) {
                      this.props.onChange(newSize);
                    }
                    ref.setState({
                        size: newSize
                    });
                }
            }
        }
    },


    onMouseUp() {
        if (this.state.active) {
            if (this.props.onDragFinished) {
                this.props.onDragFinished();
            }
            this.setState({
                active: false
            });
        }
    },


    unFocus() {
        if (document.selection) {
            document.selection.empty();
        } else {
            window.getSelection().removeAllRanges()
        }
    },


    merge: function (into, obj) {
        for (let attr in obj) {
            into[attr] = obj[attr];
        }
    },


    render() {

        const split = this.props.split;

        let style = {
            display: 'flex',
            flex: 1,
            position: 'relative',
            outline: 'none',
            overflow: 'hidden',
            MozUserSelect: 'text',
            WebkitUserSelect: 'text',
            msUserSelect: 'text',
            userSelect: 'text'
        };

        if (split === 'vertical') {
            this.merge(style, {
                flexDirection: 'row',
                height: '100%',
                position: 'absolute',
                left: 0,
                right: 0
            });
        } else {
            this.merge(style, {
                flexDirection: 'column',
                height: '100%',
                minHeight: '100%',
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '100%'
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
