import React from 'react';
import SplitPane from '../src/SplitPane';
import asserter from './assertions/Asserter';


describe('Horizontal SplitPane', () => {

    describe('Defaults', () => {

        const splitPane = (
            <SplitPane split="horizontal">
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );


        it('should render the SplitPane', () => {
            asserter(splitPane).assertPaneContents(['one', 'two']);
        });


        it('should render the child panes', () => {
            asserter(splitPane).assertPaneContents(['one', 'two']);
        });


        it('should have horizontal orientation', () => {
            asserter(splitPane).assertOrientation('horizontal');
        });


        it('should contain a Resizer', () => {
            asserter(splitPane).assertContainsResizer();
        });
    });

    describe('With defaultSize property', () => {

        const splitPane = (
            <SplitPane split="horizontal" defaultSize={99} >
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );


        it('should have correct height for the top Pane', () => {
            asserter(splitPane).assertPaneHeight('99px');
        });
    });

    describe('With primary property set to second', () => {

        const splitPane = (
            <SplitPane split="horizontal" defaultSize={99} primary="second">
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );


        it('should have correct height for the bottom Pane', () => {
            asserter(splitPane).assertPaneHeight('99px', 'second');
        });
    });

    describe('Resizer move up and down', () => {

        const splitPane = (
            <SplitPane split="horizontal" defaultSize={200} minSize={50} maxSize={450}>
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );

        const moveDown = { y: 200 };

        it('after move down, the first pane should be larger than before', () => {
            asserter(splitPane, true).assertResizeByDragging(moveDown, { height: '400px' });
        });

        const moveUp = { y: -120 };

        it('after move up, the first pane should be smaller than before', () => {
            asserter(splitPane, true).assertResizeByDragging(moveUp, { height: '80px' });
        });

        const moveUpExtreme = { y: -190 };

        it('after move up, the first pane should not be smaller than `minSize`', () => {
            asserter(splitPane, true).assertResizeByDragging(moveUpExtreme, { height: '50px' });
        });

        const moveDownExtreme = { y: 300 };

        it('after move down, the first pane should not be larger than `maxSize`', () => {
            asserter(splitPane, true).assertResizeByDragging(moveDownExtreme, { height: '450px' });
        });
    });

    describe('Resizer move up and down and primary prop is set to second', () => {

        const splitPane = (
            <SplitPane split="horizontal" defaultSize={400} primary="second">
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );

        const moveDown = { y: 160 };

        it('after move down, the second pane should be smaller than before', () => {
            asserter(splitPane, true).assertResizeByDragging(moveDown, { height: '240px' });
        });

        const moveUp = { y: -111 };

        it('after move up, the second pane should be larger than before', () => {
            asserter(splitPane, true).assertResizeByDragging(moveUp, { height: '511px' });
        });
    });
    
    describe('Resizer move up and down and step prop is set to 50px', () => {

        const splitPane = (
            <SplitPane split="horizontal" defaultSize={400} minSize={200} maxSize={600} step={50}>
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );

        const moveDown = { y: 75 };

        it('after move down by 75px, first pane should only have height 450px', () => {
            asserter(splitPane, true).assertResizeByDragging(moveDown, { height: '450px' });
        });

        const moveUp = { y: -75 };

        it('after move up by 75px, first pane should only have height 350px', () => {
            asserter(splitPane, true).assertResizeByDragging(moveUp, { height: '350px' });
        });

        const moveDownSmall = { y: 25 };

        it('after move down by 75px, first pane should still have height 400px', () => {
            asserter(splitPane, true).assertResizeByDragging(moveDownSmall, { height: '400px' });
        });

        const moveUpSmall = { y: -25 };

        it('after move up by 75px, first pane should still have height 400px', () => {
            asserter(splitPane, true).assertResizeByDragging(moveUpSmall, { height: '400px' });
        });

    });
});
