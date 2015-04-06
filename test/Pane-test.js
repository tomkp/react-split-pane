import expect from 'expect.js';
import React from 'react/addons';
const { TestUtils } = React.addons;
var Pane = require('../src/Pane');


describe('Pane', function () {

    var pane = TestUtils.renderIntoDocument(
        <Pane />
    );

    it('should render the Pane', function () {
        const component = TestUtils.findRenderedDOMComponentWithClass(pane, 'Pane');
    });

});