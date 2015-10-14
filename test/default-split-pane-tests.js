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

