import React from 'react/addons';
const { TestUtils } = React.addons;
import SplitPane from '../lib/SplitPane';
import Resizer from '../lib/Resizer';
import Asserter from './assertions/Asserter';



describe('Vertical SplitPane', function () {


    describe('Defaults', function () {

        const splitPane = (
            <SplitPane split="vertical">
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );


        it('should render the SplitPane', function () {
            new Asserter(splitPane).assertPaneContents(['one', 'two']);
        });


        it('should use correct css properties', function () {
            new Asserter(splitPane).assertSplitPaneStyles({
                display: '-webkit-flex',
                height: '100%',
                left: '0px',
                position: 'absolute',
                outline: 'none',
                overflow: 'hidden',
                right: '0px',
                WebkitFlex: '1 1 0px',
                WebkitFlexDirection: 'row',
                WebkitUserSelect: 'none'
            });
        });


        it('should use correct css properties for the left Pane', function () {
            new Asserter(splitPane).assertFirstPaneStyles({
                position: 'relative',
                outline: 'none',
                overflow: 'auto',
                WebkitFlex: '1 1 0px'
            });
        });


        it('should use correct css properties for the right Pane', function () {
            new Asserter(splitPane).assertSecondPaneStyles({
                position: 'relative',
                outline: 'none',
                overflow: 'auto',
                WebkitFlex: '1 1 0px'
            });
        });


        it('should have vertical orientation', function () {
            new Asserter(splitPane).assertOrientation('vertical');
        });


        it('should contain a Resizer', function () {
            new Asserter(splitPane).assertContainsResizer();
        });
    });



    describe('With defaultSize property', function () {

        const splitPane = (
            <SplitPane split="vertical" defaultSize="99" >
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );


        it('should render the SplitPane', function () {
            new Asserter(splitPane).assertPaneContents(['one', 'two']);
        });


        it('should use correct css properties', function () {
            new Asserter(splitPane).assertSplitPaneStyles({
                display: '-webkit-flex',
                height: '100%',
                left: '0px',
                position: 'absolute',
                outline: 'none',
                overflow: 'hidden',
                right: '0px',
                WebkitFlex: '1 1 0px',
                WebkitFlexDirection: 'row',
                WebkitUserSelect: 'none'
            });
        });


        it('should use correct css properties for the left Pane', function () {
            new Asserter(splitPane).assertFirstPaneStyles({
                position: 'relative',
                outline: 'none',
                overflow: 'auto',
                WebkitFlex: '0 0 auto',
                width: '99px'
            });
        });


        it('should use correct css properties for the right Pane', function () {
            new Asserter(splitPane).assertSecondPaneStyles({
                position: 'relative',
                outline: 'none',
                overflow: 'auto',
                WebkitFlex: '1 1 0px',
                width: ''
            });
        });


        it('should render the child panes', function () {
            new Asserter(splitPane).assertPaneContents(['one', 'two']);
        });


        it('should have vertical orientation', function () {
            new Asserter(splitPane).assertOrientation('vertical');
        });


        it('should contain a Resizer', function () {
            new Asserter(splitPane).assertContainsResizer();
        });
    });

});
