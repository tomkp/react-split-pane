import React from 'react/addons';
import SplitPane from '../../lib/SplitPane';
import Resizer from '../../lib/Resizer';
import chai from 'chai';
const { TestUtils } = React.addons;
const expect = chai.expect;
import VendorPrefix from 'react-vendor-prefix';



export default (jsx) => {


    const splitPane = TestUtils.renderIntoDocument(jsx);
    const component = TestUtils.findRenderedDOMComponentWithClass(splitPane, 'SplitPane');


    const findPanes = () => {
        return TestUtils.scryRenderedDOMComponentsWithClass(component, 'Pane');
    };


    const findTopPane = () => {
        return findPanes()[0];
    };


    const findResizer = () => {
        return TestUtils.scryRenderedComponentsWithType(splitPane, Resizer);
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
        return assertStyles('First Pane', findTopPane().getDOMNode().style, expectedStyles);
    };


    return {

        assertOrientation(expectedOrientation) {
            expect(component.getDOMNode().className).to.contain(expectedOrientation, `Incorrect orientation`);
            return this;
        },


        assertPaneContents(expectedContents) {
            const panes = findPanes();
            let values = panes.map((pane) => {
                return pane.getDOMNode().textContent;
            });
            expect(values).to.eql(expectedContents, `Incorrect contents for Pane`);
            return this;
        },


        assertContainsResizer(){
            expect(component.props.children.length).to.equal(3, `Expected the SplitPane to have 3 children`);
            const resizer = findResizer();
            expect(resizer.length).to.equal(1, `Expected to have a single Resizer`);
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

