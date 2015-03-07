jest.dontMock('../Pane');

var React = require('react/addons');
var TU = React.addons.TestUtils;
var Pane = require('../Pane');


describe('Pane', function () {

    var pane = TU.renderIntoDocument(
        <Pane />
    );

    it('renders the Pane', function () {
        console.info('renders the Pane');
        var component = TU.findRenderedDOMComponentWithClass(pane, 'Pane');
    });

});