import React, { Component } from 'react';
import { render } from 'react-dom';
import SplitPane from '../lib/SplitPane';


const SimpleNestedExample = () => {
    return (
        <SplitPane split="vertical" minSize={50} maxSize={300} defaultSize={100} className="primary">
            <div />
            <SplitPane split="horizontal">
                <div />
                <div />
            </SplitPane>
        </SplitPane>
    );
};

const BasicVerticalExample = () => {
    return (
        <SplitPane split="vertical">
            <div />
            <div />
        </SplitPane>
    );
};

const BasicHorizontalExample = () => {
    return (
        <SplitPane split="horizontal">
            <div />
            <div />
        </SplitPane>
    );
};

const PercentageVerticalExample = () => {
    return (
        <SplitPane defaultSize="50%">
            <div />
            <div />
        </SplitPane>
    );
};

const PercentageHorizontalExample = () => {
    return (
        <SplitPane defaultSize="50%" split="horizontal">
            <div />
            <div />
        </SplitPane>
    );
};

const VerticallyNestedInContainerExample = () => {
    return (
        <SplitPane defaultSize="40%" split="vertical">
            <div />
            <div />
        </SplitPane>
    );
};

const HorizontallyNestedInContainerExample = () => {
    return (
        <SplitPane defaultSize="40%" split="horizontal">
            <div />
            <div />
        </SplitPane>
    );
};

const MultipleVerticalExample = () => {
    return (
        <SplitPane split="vertical" defaultSize="33%">
            <div />
            <SplitPane split="vertical" defaultSize="50%">
                <div />
                <div />
            </SplitPane>
        </SplitPane>
    );
};

const MultipleHorizontalExample = () => {
    return (
        <SplitPane split="horizontal" defaultSize="33%">
            <div />
            <SplitPane split="horizontal" defaultSize="50%">
                <div />
                <div />
            </SplitPane>
        </SplitPane>
    );
};

const SubComponentExample = () => {
    return (
        <div className="parent">
            <div className="header">Header</div>
            <div className="wrapper">
                <SplitPane split="horizontal" defaultSize="50%">
                    <div />
                    <div />
                </SplitPane>
            </div>
        </div>
    );
};

const InlineStyleExample = () => {
    const styleA = { background: '#eee' };
    const styleB = { background: '#aaa4ba' };
    const styleC = { background: '#000' };
    const styleD = { padding: '2em', fontStyle: 'italic' };
    return (
        <SplitPane
            split="vertical"
            minSize={50} maxSize={300} defaultSize={100}
            className="primary"
            pane1Style={styleA}
            resizerStyle={styleC}>
            <div />
            <SplitPane split="horizontal" paneStyle={styleD} pane2Style={styleB}>
                <div>Hello...</div>
                <div> ...world.</div>
            </SplitPane>
        </SplitPane>
    );
};

class SnapToPositionExample extends Component {

    constructor(props) {
        super(props);
        this.state = {
            size: undefined,
            dragging: false,
        };
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }

    handleDragStart() {
        this.setState({
            dragging: true,
        });
    }

    handleDragEnd() {
        this.setState({
            dragging: false,
        });
        setTimeout(() => {
            this.setState({ size: undefined });
        }, 0);
    }

    handleDrag(width) {
        if (width >= 300 && width <= 400) {
            this.setState({ size: 300 });
        } else if (width > 400 && width <= 500) {
            this.setState({ size: 500 });
        } else {
            this.setState({ size: undefined });
        }
    }

    render() {
        const dropWarnStyle = {
            backgroundColor: 'yellow',
            left: 300,
            width: 200,
        };
        const centeredTextStyle = {
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
        };
        return (
            <div style={{ height: '100%' }}>
                <SplitPane
                    size={this.state.dragging ? undefined : this.state.size}
                    onChange={this.handleDrag}
                    onDragStarted={this.handleDragStart}
                    onDragFinished={this.handleDragEnd}
                >
                    <div style={{ backgroundColor: 'blue', height: '100%', zIndex: 1, opacity: 0.1 }} />
                    <div />
                </SplitPane>
                <div style={Object.assign({}, centeredTextStyle, { left: 0, width: 300 })}>
                    Can drop anywhere
                </div>
                <div style={Object.assign({}, centeredTextStyle, dropWarnStyle)}>
                    Will snap to edges
                </div>
                <div style={Object.assign({}, centeredTextStyle, { left: 500, width: 'calc(100% - 500px)' })}>
                    Can drop anywhere
                </div>
            </div>

        );
    }

}

if (document.getElementById('simple-nested-example')) render(<SimpleNestedExample />, document.getElementById('simple-nested-example'));
if (document.getElementById('basic-vertical-example')) render(<BasicVerticalExample />, document.getElementById('basic-vertical-example'));
if (document.getElementById('basic-horizontal-example')) render(<BasicHorizontalExample />, document.getElementById('basic-horizontal-example'));
if (document.getElementById('percentage-vertical-example')) render(<PercentageVerticalExample />, document.getElementById('percentage-vertical-example'));
if (document.getElementById('percentage-horizontal-example')) render(<PercentageHorizontalExample />, document.getElementById('percentage-horizontal-example'));
if (document.getElementById('vertically-nested-in-container-example')) render(<VerticallyNestedInContainerExample />, document.getElementById('vertically-nested-in-container-example'));
if (document.getElementById('horizontally-nested-in-container-example')) render(<HorizontallyNestedInContainerExample />, document.getElementById('horizontally-nested-in-container-example'));
if (document.getElementById('multiple-vertical-example')) render(<MultipleVerticalExample />, document.getElementById('multiple-vertical-example'));
if (document.getElementById('multiple-horizontal-example')) render(<MultipleHorizontalExample />, document.getElementById('multiple-horizontal-example'));
if (document.getElementById('subcomponent-example')) render(<SubComponentExample />, document.getElementById('subcomponent-example'));
if (document.getElementById('inline-style-example')) render(<InlineStyleExample />, document.getElementById('inline-style-example'));
if (document.getElementById('snap-to-position-example')) render(<SnapToPositionExample />, document.getElementById('snap-to-position-example'));
