import expect from 'expect.js';
import React from 'react/addons';
const { TestUtils } = React.addons;
const Pane = require('../src/Pane');


describe('Pane', function () {

    const pane = TestUtils.renderIntoDocument(
        <Pane />
    );

    it('should render the Pane', function () {
        const component = TestUtils.findRenderedDOMComponentWithClass(pane, 'Pane');
    });

});