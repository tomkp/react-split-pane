import expect from 'expect.js';
import React from 'react/addons';
const { TestUtils } = React.addons;
import Resizer from '../src/Resizer';

describe('Resizer', function () {

    var resizer = TestUtils.renderIntoDocument(
        <Resizer />
    );

    it('should render the Resizer', function () {
        const component = TestUtils.findRenderedDOMComponentWithClass(resizer, 'Resizer');
        //expect(component.getDOMNode().textContent).to.equal('3');
    });

});