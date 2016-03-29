import React from 'react';
import SplitPane from '../lib/SplitPane';
import Resizer from '../lib/Resizer';
import asserter from './assertions/Asserter';



describe('Default SplitPane', function () {

    const splitPane = (
        <SplitPane>
            <div>one</div>
            <div>two</div>
        </SplitPane>
    );


    it('should render the child panes', function () {
         asserter(splitPane).assertPaneContents(['one', 'two']);
    });

    it('should have vertical orientation', function () {
         asserter(splitPane).assertOrientation('vertical');
    });

    it('should contain a Resizer', function () {
         asserter(splitPane).assertContainsResizer();
    });
    
});


describe('SplitPane can have a specific class', function () {

    const splitPane = (
        <SplitPane className="some-class">
            <div>one</div>
            <div>two</div>
        </SplitPane>
    );


    it('should have the specified class', function () {
        asserter(splitPane).assertSplitPaneClass('some-class');
    });

});


describe('Internal Panes have class', function () {

    const splitPane = (
        <SplitPane className="some-class">
            <div>one</div>
            <div>two</div>
        </SplitPane>
    );


    it('should have the specified classname', function () {
        asserter(splitPane).assertPaneClasses('Pane1', 'Pane2');
    });

});
