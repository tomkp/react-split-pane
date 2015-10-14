import React from 'react';
import SplitPane from '../lib/SplitPane';
import Resizer from '../lib/Resizer';
import asserter from './assertions/Asserter';


describe('Vertical SplitPane', function () {


    describe('Defaults', function () {

        const splitPane = (
            <SplitPane split="vertical">
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );


        it('should render the SplitPane', function () {
            asserter(splitPane).assertPaneContents(['one', 'two']);
        });


        it('should have vertical orientation', function () {
            asserter(splitPane).assertOrientation('vertical');
        });


        it('should contain a Resizer', function () {
            asserter(splitPane).assertContainsResizer();
        });
    });



    describe('With defaultSize property', function () {

        const splitPane = (
            <SplitPane split="vertical" defaultSize="99" >
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );


        it('should have correct width for the left Pane', function () {
            asserter(splitPane).assertFirstPaneWidth('99px');
        });
    });

});
