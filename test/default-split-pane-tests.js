import React from 'react';
import chai from 'chai';
import spies from 'chai-spies';

import SplitPane from '../src/SplitPane';
import asserter from './assertions/Asserter';

chai.use(spies);

describe('Default SplitPane', () => {

    const splitPane = (
        <SplitPane>
            <div>one</div>
            <div>two</div>
        </SplitPane>
    );


    it('should render the child panes', () => {
        asserter(splitPane).assertPaneContents(['one', 'two']);
    });

    it('should have vertical orientation', () => {
        asserter(splitPane).assertOrientation('vertical');
    });

    it('should contain a Resizer', () => {
        asserter(splitPane).assertContainsResizer();
    });

});


describe('SplitPane can have a specific class', () => {

    const splitPane = (
        <SplitPane className="some-class">
            <div>one</div>
            <div>two</div>
        </SplitPane>
    );


    it('should have the specified class', () => {
        asserter(splitPane).assertSplitPaneClass('some-class');
    });

});


describe('SplitPane can have resizing callbacks', () => {
    const onDragStartedCallback = chai.spy(() => {
    });
    const onDragFinishedCallback = chai.spy(() => {
    });

    const splitPane = (
        <SplitPane
            className="some-class"
            onDragStarted={onDragStartedCallback}
            onDragFinished={onDragFinishedCallback}
        >
            <div>one</div>
            <div>two</div>
        </SplitPane>
    );


    it('should call callbacks on resizing', () => {
        asserter(splitPane).assertResizeCallbacks(
            onDragStartedCallback,
            onDragFinishedCallback
        );
    });

});


describe('Internal Panes have class', () => {

    const splitPane = (
        <SplitPane className="some-class">
            <div>one</div>
            <div>two</div>
        </SplitPane>
    );


    it('should have the specified classname', () => {
        asserter(splitPane).assertPaneClasses('Pane1', 'Pane2');
    });

});


describe('Internal Resizer have class', () => {

    const splitPane = (
        <SplitPane resizerClassName="some-class">
            <div>one</div>
            <div>two</div>
        </SplitPane>
    );


    it('should have the specified classname', () => {
        asserter(splitPane).assertResizerClasses('some-class');
    });
    
    it('should have the default classname', () => {
        asserter(splitPane).assertResizerClasses('Resizer');
    });

});
