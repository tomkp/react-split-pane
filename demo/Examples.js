import React from "react";
import {render} from "react-dom";
import SplitPane from "../lib/SplitPane";


const SimpleNestedExample = () => {
    return (
        <SplitPane split="vertical" minSize={50} maxSize={300} defaultSize={100} className="primary">
            <div></div>
            <SplitPane split="horizontal">
                <div></div>
                <div></div>
            </SplitPane>
        </SplitPane>
    );
};

const BasicVerticalExample = () => {
    return (
        <SplitPane split="vertical">
            <div></div>
            <div></div>
        </SplitPane>
    );
};

const BasicHorizontalExample = () => {
    return (
        <SplitPane split="horizontal">
            <div></div>
            <div></div>
        </SplitPane>
    );
};


if (document.getElementById("example1")) render(<SimpleNestedExample />, document.getElementById("example1"));
if (document.getElementById("example2")) render(<BasicVerticalExample />, document.getElementById("example2"));
if (document.getElementById("example3")) render(<BasicHorizontalExample />, document.getElementById("example3"));
