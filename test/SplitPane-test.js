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


    it('renders the SplitPane', function () {
        console.info('renders the SplitPane');
        var component = TestUtils.findRenderedDOMComponentWithClass(splitPane, 'SplitPane');
        expect(component.getDOMNode().textContent).to.equal('onetwo');
    });


    it('has className of orientation', function () {
        console.info('has className of orientation');
        var component = TestUtils.findRenderedDOMComponentWithClass(splitPane, 'SplitPane');
        expect(component.getDOMNode().className).to.contain('horizontal');
    });


    it('contains a Resizer', function () {
        console.info('inserts a Resizer');
        var component = TestUtils.findRenderedDOMComponentWithClass(splitPane, 'SplitPane');

        //console.info('component.props', component.props);
        expect(component.props.children.length).to.equal(3);

        var resizer = TestUtils.scryRenderedComponentsWithType(splitPane, Resizer);
        //console.info('resizer', resizer);
        expect(resizer.length).to.be(1);
    });

});
