import React from 'react/addons';
const { TestUtils } = React.addons;
import SplitPane from '../lib/SplitPane';
import Resizer from '../lib/Resizer';
import Asserter from './assertions/Asserter';



describe('Default SplitPane', function () {

    const splitPane = (
        <SplitPane>
            <div>one</div>
            <div>two</div>
        </SplitPane>
    );


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

