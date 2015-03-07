jest.dontMock('../Resizer');

var React = require('react/addons');
var TU = React.addons.TestUtils;
var Resizer = require('../Resizer');


describe('Resizer', function () {

    var resizer = TU.renderIntoDocument(
        <Resizer />
    );

    it('renders the Resizer', function () {
        console.info('renders the Resizer');
        var component = TU.findRenderedDOMComponentWithClass(resizer, 'Resizer');
        //expect(component.getDOMNode().textContent).toEqual('3');
    });

});