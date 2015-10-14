import React from 'react';
import SplitPane from '../lib/SplitPane';
import Resizer from '../lib/Resizer';
import asserter from './assertions/Asserter';



describe('Horizontal SplitPane', function () {

    describe('Defaults', function () {

        const splitPane = (
            <SplitPane split="horizontal">
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );


        it('should render the SplitPane', function () {
            asserter(splitPane).assertPaneContents(['one', 'two']);
        });


        it('should render the child panes', function () {
            asserter(splitPane).assertPaneContents(['one', 'two']);
        });


        it('should have horizontal orientation', function () {
            asserter(splitPane).assertOrientation('horizontal');
        });


        it('should contain a Resizer', function () {
            asserter(splitPane).assertContainsResizer();
        });
    });



    describe('With defaultSize property', function () {

        const splitPane = (
            <SplitPane split="horizontal" defaultSize="99" >
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );


        it('should have correct height for the top Pane', function () {
            asserter(splitPane).assertFirstPaneHeight('99px');
        });
    });
});


