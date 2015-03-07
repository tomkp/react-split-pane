jest.dontMock('../SplitPane');
jest.dontMock('../Resizer');
jest.dontMock('../Pane');

var React = require('react/addons');
var TU = React.addons.TestUtils;
var SplitPane = require('../SplitPane');
var Pane = require('../Pane');
var Resizer = require('../Resizer');


describe('SplitPane', function () {

    var splitPane = TU.renderIntoDocument(
        <SplitPane orientation="horizontal">
            <div>one</div>
            <div>two</div>
        </SplitPane>
    );


    it('renders the SplitPane', function () {
        console.info('renders the SplitPane');
        var component = TU.findRenderedDOMComponentWithClass(splitPane, 'SplitPane');
        expect(component.getDOMNode().textContent).toEqual('onetwo');
    });


    it('has className of orientation', function () {
        console.info('has className of orientation');
        var component = TU.findRenderedDOMComponentWithClass(splitPane, 'SplitPane');
        expect(component.getDOMNode().className).toContain('horizontal');
    });


    it('contains a Resizer', function () {
        console.info('inserts a Resizer');
        var component = TU.findRenderedDOMComponentWithClass(splitPane, 'SplitPane');

        console.info('component.props', component.props);
        expect(component.props.children.length).toEqual(3);

        var resizer = TU.scryRenderedComponentsWithType(splitPane, Resizer);
        console.info('resizer', resizer);
        expect(resizer.length).toBe(1);
    });

});
