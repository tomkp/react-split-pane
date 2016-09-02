import React from 'react';
import SplitPane from '../src/SplitPane';
import asserter from './assertions/Asserter';


describe('Vertical SplitPane', () => {

    describe('Defaults', () => {

        const splitPane = (
            <SplitPane split="vertical">
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );


        it('should render the SplitPane', () => asserter(splitPane).assertPaneContents(['one', 'two']));


        it('should have vertical orientation', () => asserter(splitPane).assertOrientation('vertical'));


        it('should contain a Resizer', () => asserter(splitPane).assertContainsResizer());
    });


    describe('With defaultSize property', () => {

        const splitPane = (
            <SplitPane split="vertical" defaultSize={99}>
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );


        it('should have correct width for the left Pane', () => {
            asserter(splitPane).assertPaneWidth('99px');
            asserter(splitPane).assertPaneWidth(null, 'second');
        });
    });


    describe('With primary property set to second', () => {

        const splitPane = (
            <SplitPane split="vertical" defaultSize={99} primary="second">
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );


        it('should have correct width for the right Pane', () => {
            asserter(splitPane).assertPaneWidth(null);
            asserter(splitPane).assertPaneWidth('99px', 'second');
        });
    });


    describe('Resizer move to the right and left', () => {

        const splitPane = (
            <SplitPane split="vertical" defaultSize={200} minSize={50} maxSize={450}>
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );

        const moveToRight = { x: 200 };

        it('after move to right, the first pane should be larger than before', () => {
            asserter(splitPane, true).assertResizeByDragging(moveToRight, { width: '400px' });
        });

        const moveToLeft = { x: -120 };

        it('after move to left, the first pane should be smaller than before', () => {
            asserter(splitPane, true).assertResizeByDragging(moveToLeft, { width: '80px' });
        });

        const moveLeftExtreme = { x: -190 };

        it('after move to left, the first pane should not be smaller than `minSize`', () => {
            asserter(splitPane, true).assertResizeByDragging(moveLeftExtreme, { width: '50px' });
        });

        const moveRightExtreme = { x: 300 };

        it('after move to right, the first pane should not be larger than `minSize`', () => {
            asserter(splitPane, true).assertResizeByDragging(moveRightExtreme, { width: '450px' });
        });
    });

    describe('Resizer move to the right and left and primary prop is set to second', () => {

        const splitPane = (
            <SplitPane split="vertical" defaultSize={400} primary="second">
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );

        const moveToRight = { x: 160 };

        it('after move to right, the second pane should be smaller then before', () => {
            asserter(splitPane, true).assertResizeByDragging(moveToRight, { width: '240px' });
        });

        const moveToLeft = { x: -111 };

        it('after move to left, the second pane should be larger then before', () => {
            asserter(splitPane, true).assertResizeByDragging(moveToLeft, { width: '511px' });
        });
    });
});
