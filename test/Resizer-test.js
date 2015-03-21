import expect from 'expect.js';
import React from 'react/addons';
let { TestUtils } = React.addons;
import Resizer from '../src/Resizer';

describe('Resizer', function () {

    var resizer = TestUtils.renderIntoDocument(
        <Resizer />
    );

    it('renders the Resizer', function () {
        console.info('renders the Resizer');
        var component = TestUtils.findRenderedDOMComponentWithClass(resizer, 'Resizer');
        //expect(component.getDOMNode().textContent).to.equal('3');
    });

});