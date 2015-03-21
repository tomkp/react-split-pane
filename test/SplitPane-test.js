import expect from 'expect.js';
import React from 'react/addons';
let { TestUtils } = React.addons;
import SplitPane from '../src/SplitPane';
import Resizer from '../src/Resizer';


describe('SplitPane', function () {

    var splitPane = TestUtils.renderIntoDocument(
        <SplitPane orientation="horizontal">
            <div>one</div>
            <div>two</div>
        </SplitPane>
    );


    it('should render the SplitPane', function () {
        var component = TestUtils.findRenderedDOMComponentWithClass(splitPane, 'SplitPane');
        expect(component.getDOMNode().textContent).to.equal('onetwo');
    });


    it('should have className of orientation', function () {
        var component = TestUtils.findRenderedDOMComponentWithClass(splitPane, 'SplitPane');
        expect(component.getDOMNode().className).to.contain('horizontal');
    });


    it('should contain a Resizer', function () {
        var component = TestUtils.findRenderedDOMComponentWithClass(splitPane, 'SplitPane');
        expect(component.props.children.length).to.equal(3);
        var resizer = TestUtils.scryRenderedComponentsWithType(splitPane, Resizer);
        expect(resizer.length).to.be(1);
    });

});
