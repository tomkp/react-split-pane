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

const PercentageSplitExample = () => {
    return (
        <SplitPane defaultSize="50%">
            <div></div>
            <div></div>
        </SplitPane>
    );
};


if (document.getElementById("simple-nested-example")) render(<SimpleNestedExample />, document.getElementById("simple-nested-example"));
if (document.getElementById("basic-vertical-example")) render(<BasicVerticalExample />, document.getElementById("basic-vertical-example"));
if (document.getElementById("basic-horizontal-example")) render(<BasicHorizontalExample />, document.getElementById("basic-horizontal-example"));
if (document.getElementById("percentage-split-example")) render(<PercentageSplitExample />, document.getElementById("percentage-split-example"));
