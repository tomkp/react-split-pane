import React from 'react';
import ReactDOM from 'react-dom';
import SplitPane from '../../lib/SplitPane';
import Resizer from '../../lib/Resizer';
import Pane from '../../lib/Pane';
import chai from 'chai';
const expect = chai.expect;
import VendorPrefix from 'react-vendor-prefix';
import ReactTestUtils from 'react-addons-test-utils';



export default (jsx) => {


    const splitPane = ReactTestUtils.renderIntoDocument(jsx);
    const component = ReactTestUtils.findRenderedComponentWithType(splitPane, SplitPane);


    const findPanes = () => {
        return ReactTestUtils.scryRenderedComponentsWithType(component, Pane);
    };


    const findTopPane = () => {
        return findPanes()[0];
    };


    const findResizer = () => {
        return ReactTestUtils.scryRenderedComponentsWithType(splitPane, Resizer);
    };


    const assertStyles = (componentName, actualStyles, expectedStyles) => {
        const prefixed = VendorPrefix.prefix({styles: expectedStyles}).styles;
        for (let prop in prefixed) {
            if (prefixed.hasOwnProperty(prop)) {
                //console.log(prop + ': \'' + actualStyles[prop] + '\',');
                if (prefixed[prop] && prefixed[prop] !== '') {
                    //console.log(prop + ': \'' + actualStyles[prop] + '\',');
                    expect(actualStyles[prop]).to.equal(prefixed[prop], `${componentName} has incorrect css property for '${prop}'`);
                }
                //expect(actualStyles[prop]).to.equal(prefixed[prop], `${componentName} has incorrect css property for '${prop}'`);
            }
        }
        return this;
    };


    const assertFirstPaneStyles= (expectedStyles) => {
        return assertStyles('First Pane', ReactDOM.findDOMNode(findTopPane()).style, expectedStyles);
    };


    return {

        assertOrientation(expectedOrientation) {
            expect(ReactDOM.findDOMNode(component).className).to.contain(expectedOrientation, `Incorrect orientation`);
            return this;
        },


        assertPaneContents(expectedContents) {
            const panes = findPanes();
            let values = panes.map((pane) => {
                return ReactDOM.findDOMNode(pane).textContent;
            });
            expect(values).to.eql(expectedContents, `Incorrect contents for Pane`);
            return this;
        },


        assertContainsResizer(){
            expect(findResizer().length).to.equal(1, `Expected the SplitPane to have a single Resizer`);
            expect(findPanes().length).to.equal(2, `Expected the SplitPane to have 2 panes`);
            return this;
        },


        assertFirstPaneWidth(expectedWidth) {
            return assertFirstPaneStyles({width: expectedWidth});
        },


        assertFirstPaneHeight(expectedHeight) {
            return assertFirstPaneStyles({height: expectedHeight});
        }
    }
}

