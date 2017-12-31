import React, { Component } from 'react';
import { render } from 'react-dom';
import SplitPane from '../lib/SplitPane';
import Pane from "../lib/Pane";


const SimpleNestedExample = () => {
    return (
        <SplitPane split="vertical">
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

const BasicVerticalPaneExample = () => {
  return (
    <SplitPane split="vertical">
      <Pane />
      <Pane />
    </SplitPane>
  );
};

const BasicHorizontalPaneExample = () => {
  return (
    <SplitPane split="horizontal">
      <Pane />
      <Pane />
    </SplitPane>
  );
};

const InitialPercentageVerticalExample = () => {
    return (
        <SplitPane >
            <Pane initialSize="20%" />
            <div />
        </SplitPane>
    );
};

const InitialPercentageHorizontalExample = () => {
    return (
        <SplitPane split="horizontal">
            <div />
            <Pane initialSize="20%" />
        </SplitPane>
    );
};


const InitialPxVerticalExample = () => {
  return (
    <SplitPane >
      <Pane initialSize="200px" />
      <div />
    </SplitPane>
  );
};

const InitialPxHorizontalExample = () => {
  return (
    <SplitPane split="horizontal">
      <div />
      <Pane initialSize="200px" />
    </SplitPane>
  );
};



const MinPercentageVerticalExample = () => {
  return (
    <SplitPane >
      <Pane minSize="20%" />
      <div />
    </SplitPane>
  );
};

const MinPercentageHorizontalExample = () => {
  return (
    <SplitPane split="horizontal">
      <div />
      <Pane minSize="20%" />
    </SplitPane>
  );
};


const MinPxVerticalExample = () => {
  return (
    <SplitPane >
      <Pane minSize="200px" />
      <div />
    </SplitPane>
  );
};

const MinPxHorizontalExample = () => {
  return (
    <SplitPane split="horizontal">
      <div />
      <Pane minSize="200px" />
    </SplitPane>
  );
};



const MaxPercentageVerticalExample = () => {
  return (
    <SplitPane >
      <Pane maxSize="20%" />
      <div />
    </SplitPane>
  );
};

const MaxPercentageHorizontalExample = () => {
  return (
    <SplitPane split="horizontal">
      <div />
      <Pane maxSize="20%" />
    </SplitPane>
  );
};


const MaxPxVerticalExample = () => {
  return (
    <SplitPane >
      <Pane maxSize="200px" />
      <div />
    </SplitPane>
  );
};

const MaxPxHorizontalExample = () => {
  return (
    <SplitPane split="horizontal">
      <div />
      <Pane maxSize="200px" />
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
        <SplitPane split="vertical">
            <div />
            <div />
            <div />
            <div />
        </SplitPane>
    );
};

const MultipleHorizontalExample = () => {
    return (
        <SplitPane split="horizontal">
          <div />
          <div />
          <div />
          <div />
        </SplitPane>
    );
};

const SubComponentExample = () => {
    return (
        <div className="parent">
            <div className="header">Header</div>
            <div className="wrapper">
                <SplitPane split="horizontal">
                    <div />
                    <div />
                </SplitPane>
            </div>
        </div>
    );
};


const examples = {
  SimpleNestedExample,
  SubComponentExample,
  MultipleHorizontalExample,
  MultipleVerticalExample,
  HorizontallyNestedInContainerExample,
  VerticallyNestedInContainerExample,
  MaxPxHorizontalExample,
  MaxPxVerticalExample,
  MaxPercentageHorizontalExample,
  MaxPercentageVerticalExample,
  MinPxHorizontalExample,
  MinPxVerticalExample,
  MinPercentageHorizontalExample,
  MinPercentageVerticalExample,
  InitialPxHorizontalExample,
  InitialPxVerticalExample,
  InitialPercentageHorizontalExample,
  InitialPercentageVerticalExample,
  BasicHorizontalPaneExample,
  BasicVerticalPaneExample,
  BasicHorizontalExample,
  BasicVerticalExample,
};


const name = document.location.search.substr(1);
const component = examples[name];
render(component(), document.getElementById('root'));

