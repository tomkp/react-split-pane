import React from 'react/addons';
const { TestUtils } = React.addons;
import SplitPane from '../lib/SplitPane';
import Resizer from '../lib/Resizer';
import Asserter from './assertions/Asserter';



describe('Horizontal SplitPane', function () {

    describe('Defaults', function () {

        const splitPane = (
            <SplitPane split="horizontal">
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );


        it('should render the SplitPane', function () {
            new Asserter(splitPane).assertPaneContents(['one', 'two']);
        });


        it('should render the child panes', function () {
            new Asserter(splitPane).assertPaneContents(['one', 'two']);
        });


        it('should have horizontal orientation', function () {
            new Asserter(splitPane).assertOrientation('horizontal');
        });


        it('should contain a Resizer', function () {
            new Asserter(splitPane).assertContainsResizer();
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
            new Asserter(splitPane).assertFirstPaneHeight('99px');
        });
    });
});


