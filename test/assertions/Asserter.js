import React from 'react/addons';
import SplitPane from '../../lib/SplitPane';
import Resizer from '../../lib/Resizer';
import chai from 'chai';
const { TestUtils } = React.addons;
const expect = chai.expect;
import VendorPrefix from 'react-vendor-prefix';




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
        const prefixed = VendorPrefix.prefix({styles: expectedStyles}).styles;
        for (let prop in prefixed) {
            if( prefixed.hasOwnProperty( prop ) ) {
                //console.log(prop + ': \'' + actualStyles[prop] + '\',');
                if (prefixed[prop] && prefixed[prop] !== '') {
                    //console.log(prop + ': \'' + actualStyles[prop] + '\',');
                    expect(actualStyles[prop]).to.equal(prefixed[prop], `${componentName} has incorrect css property for '${prop}'`);
                }
                //expect(actualStyles[prop]).to.equal(prefixed[prop], `${componentName} has incorrect css property for '${prop}'`);
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

