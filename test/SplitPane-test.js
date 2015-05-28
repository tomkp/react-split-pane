import expect from 'expect.js';
import React from 'react/addons';
const { TestUtils } = React.addons;
import SplitPane from '../src/SplitPane';
import Resizer from '../src/Resizer';


describe('Default SplitPane', function () {

    const splitPane = TestUtils.renderIntoDocument(
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



describe('Horizontal SplitPane', function () {

    const splitPane = TestUtils.renderIntoDocument(
        <SplitPane orientation="horizontal">
            <div>one</div>
            <div>two</div>
        </SplitPane>
    );


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



describe('Vertical SplitPane', function () {

    const splitPane = TestUtils.renderIntoDocument(
        <SplitPane orientation="vertical">
            <div>one</div>
            <div>two</div>
        </SplitPane>
    );


    it('should render the SplitPane', function () {
        const component = TestUtils.findRenderedDOMComponentWithClass(splitPane, 'SplitPane');
        expect(component.getDOMNode().textContent).to.equal('onetwo');
    });


    it('should have vertical orientation', function () {
        new Asserter(splitPane).assertOrientation('vertical');
    });


    it('should contain a Resizer', function () {
        new Asserter(splitPane).assertContainsResizer();
    });

});





class Asserter {

    constructor(splitPane) {
        this.component = TestUtils.findRenderedDOMComponentWithClass(splitPane, 'SplitPane');
        this.splitPane = splitPane;
    }


    assertOrientation(expectedOrientation) {
        expect(this.component.getDOMNode().className).to.contain(expectedOrientation);
        return this;
    }


    assertPaneContents(expectedContents) {
        let panes = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'Pane');
        var values = panes.map((pane) => {
            return pane.getDOMNode().textContent;
        });
        expect(values).to.eql(expectedContents);
        return this;
    }


    assertContainsResizer(){
        expect(this.component.props.children.length).to.equal(3);
        const resizer = TestUtils.scryRenderedComponentsWithType(this.splitPane, Resizer);
        expect(resizer.length).to.be(1);
    }
}

