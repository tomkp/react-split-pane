import React from 'react/addons';
import SplitPane from '../../lib/SplitPane';
import Resizer from '../../lib/Resizer';
import chai from 'chai';
const { TestUtils } = React.addons;
const expect = chai.expect;



export default class Asserter {


    constructor(jsx) {
        this.splitPane = TestUtils.renderIntoDocument(jsx);
        this.component = TestUtils.findRenderedDOMComponentWithClass(this.splitPane, 'SplitPane');
    }


    assertOrientation(expectedOrientation) {
        expect(this.component.getDOMNode().className).to.contain(expectedOrientation, `Incorrect orientation`);
        return this;
    }


    assertPaneContents(expectedContents) {
        const panes = this.findPanes();
        let values = panes.map((pane) => {
            return pane.getDOMNode().textContent;
        });
        expect(values).to.eql(expectedContents, `Incorrect contents for Pane`);
        return this;
    }


    assertSplitPaneStyles(expectedStyles) {
        return this.assertStyles('SplitPane', this.component.getDOMNode().style, expectedStyles);
    }


    assertFirstPaneStyles(expectedStyles) {
        return this.assertStyles('First Pane', this.findTopPane().getDOMNode().style, expectedStyles);
    }


    assertSecondPaneStyles(expectedStyles) {
        return this.assertStyles('Second Pane', this.findBottomPane().getDOMNode().style, expectedStyles);
    }


    assertStyles(componentName, actualStyles, expectedStyles) {
        for (let prop in expectedStyles) {
            if( expectedStyles.hasOwnProperty( prop ) ) {
                //console.log(prop + ': \'' + splitPaneStyles[prop] + '\',');
                expect(actualStyles[prop]).to.equal(expectedStyles[prop], `${componentName} has incorrect css property for '${prop}'`);
            }
        }
        return this;
    }


    assertContainsResizer(){
        expect(this.component.props.children.length).to.equal(3, `Expected the SplitPane to have 3 children`);
        const resizer = this.findResizer();
        expect(resizer.length).to.equal(1, `Expected to have a single Resizer`);
        return this;
    }


    selectResizer() {
        const resizer = this.findResizer();
        TestUtils.Simulate.mouseDown(resizer);
        return this;
    }


    findTopPane() {
        return this.findPanes()[0];
    }


    findBottomPane() {
        return this.findPanes()[1];
    }


    findPanes() {
        return TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'Pane');
    }


    findResizer() {
        return TestUtils.scryRenderedComponentsWithType(this.splitPane, Resizer);
    }
}

