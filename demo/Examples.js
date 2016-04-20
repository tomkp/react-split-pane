import React from 'react';
import {render} from 'react-dom';
import SplitPane from '../lib/SplitPane';


var Example1 = React.createClass({
    render: function() {
        return (
            <SplitPane split="vertical" minSize={50} maxSize={300} defaultSize={100} className="primary">
                <div></div>
                <SplitPane split="horizontal">
                    <div></div>
                    <div></div>
                </SplitPane>
            </SplitPane>
        );
    }
});


var Example2 = React.createClass({
    render: function() {
        return (
            <SplitPane split="vertical">
                <div></div>
                <div></div>
            </SplitPane>
        );
    }
});

var Example3 = React.createClass({
    render: function() {
        return (
            <SplitPane split="horizontal">
                <div></div>
                <div></div>
            </SplitPane>
        );
    }
});



if (document.getElementById("example1")) render(<Example1 />, document.getElementById("example1"));
if (document.getElementById("example2")) render(<Example2 />, document.getElementById("example2"));
if (document.getElementById("example3")) render(<Example3 />, document.getElementById("example3"));
