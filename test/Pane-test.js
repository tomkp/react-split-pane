import expect from 'expect.js';
import React from 'react/addons';
let { TestUtils } = React.addons;
var Pane = require('../src/Pane');


describe('Pane', function () {

    var pane = TestUtils.renderIntoDocument(
        <Pane />
    );

    it('renders the Pane', function () {
        console.info('renders the Pane');
        var component = TestUtils.findRenderedDOMComponentWithClass(pane, 'Pane');
    });

});