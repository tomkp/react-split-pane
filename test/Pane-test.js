import expect from 'expect.js';
import React from 'react/addons';
let { TestUtils } = React.addons;
var Pane = require('../src/Pane');


describe('Pane', function () {

    var pane = TestUtils.renderIntoDocument(
        <Pane />
    );

    it('should render the Pane', function () {
        var component = TestUtils.findRenderedDOMComponentWithClass(pane, 'Pane');
    });

});