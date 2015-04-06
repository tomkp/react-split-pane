import expect from 'expect.js';
import React from 'react/addons';
const { TestUtils } = React.addons;
import SplitPane from '../src/SplitPane';
import Resizer from '../src/Resizer';


describe('SplitPane', function () {

    const splitPane = TestUtils.renderIntoDocument(
        <SplitPane orientation="horizontal">
            <div>one</div>
            <div>two</div>
        </SplitPane>
    );


    it('should render the SplitPane', function () {
        const component = TestUtils.findRenderedDOMComponentWithClass(splitPane, 'SplitPane');
        expect(component.getDOMNode().textContent).to.equal('onetwo');
    });


    it('should have className of orientation', function () {
        const component = TestUtils.findRenderedDOMComponentWithClass(splitPane, 'SplitPane');
        expect(component.getDOMNode().className).to.contain('horizontal');
    });


    it('should contain a Resizer', function () {
        const component = TestUtils.findRenderedDOMComponentWithClass(splitPane, 'SplitPane');
        expect(component.props.children.length).to.equal(3);
        const resizer = TestUtils.scryRenderedComponentsWithType(splitPane, Resizer);
        expect(resizer.length).to.be(1);
    });

});
