import { render, findDOMNode } from 'react-dom';
import chai from 'chai';
import spies from 'chai-spies';
import ReactTestUtils from 'react-dom/test-utils';
import SplitPane from '../../src/SplitPane';
import Resizer from '../../src/Resizer';
import Pane from '../../src/Pane';

const expect = chai.expect;

chai.use(spies);

/**
 * getBoundingClientRect() does not work correctly with ReactTestUtils.renderIntoDocument().
 * So for testing resizing we need  ReactDOM.render()
 */
function renderComponent(
  jsx: React.DOMElement<any, any>,
  renderToDOM: boolean = false
) {
  if (renderToDOM) {
    const testDiv = document.createElement('div');
    document.body.appendChild(testDiv);
    return render(jsx, testDiv);
  }
  return ReactTestUtils.renderIntoDocument(jsx);
}

const coerceFindDOMNode = (node: any) => findDOMNode(node) as HTMLElement;

export default (jsx, renderToDom = false) => {
  const splitPane = renderComponent(jsx, renderToDom);
  const component = ReactTestUtils.findRenderedComponentWithType(
    splitPane,
    SplitPane as any
  );

  const findPanes = () =>
    ReactTestUtils.scryRenderedComponentsWithType(component, Pane as any);

  const findTopPane = () => findPanes()[0];

  const findBottomPane = () => findPanes()[1];

  const findPaneByOrder = paneString =>
    paneString === 'first' ? findTopPane() : findBottomPane();

  const findResizer = () =>
    ReactTestUtils.scryRenderedComponentsWithType(splitPane, Resizer as any);

  const updateComponent = newJsx =>
    render(newJsx, coerceFindDOMNode(splitPane).parentNode as any);

  const assertStyles = (componentName, actualStyles, expectedStyles) => {
    Object.keys(expectedStyles).forEach(prop => {
      // console.log(`${prop}: '${actualStyles[prop]}',`);
      if (expectedStyles[prop] && expectedStyles[prop] !== '') {
        // console.log(`${prop}: '${actualStyles[prop]}',`);
        expect(actualStyles[prop]).to.equal(
          expectedStyles[prop],
          `${componentName} has incorrect css property for '${prop}'`
        );
      }
    });
    return this;
  };

  const assertPaneStyles = (expectedStyles, paneString) => {
    const pane = findPaneByOrder(paneString);
    return assertStyles(
      `${paneString} Pane`,
      coerceFindDOMNode(pane).style,
      expectedStyles
    );
  };

  const assertCallbacks = (
    expectedDragStartedCallback,
    expectedDragFinishedCallback
  ) => {
    expect(expectedDragStartedCallback).to.have.been.called();
    expect(expectedDragFinishedCallback).to.have.been.called();
  };

  const getResizerPosition = () => {
    const resizerNode = coerceFindDOMNode(findResizer()[0]);
    return resizerNode.getBoundingClientRect();
  };

  const calculateMouseMove = mousePositionDifference => {
    const resizerPosition = getResizerPosition();
    const mouseMove = {
      start: {
        clientX: resizerPosition.left,
        clientY: resizerPosition.top,
      },
      end: {
        clientX: resizerPosition.left,
        clientY: resizerPosition.top,
      },
    };

    if (mousePositionDifference.x) {
      mouseMove.end.clientX = resizerPosition.left + mousePositionDifference.x;
    } else if (mousePositionDifference.y) {
      mouseMove.end.clientY = resizerPosition.top + mousePositionDifference.y;
    }

    return mouseMove;
  };

  const simulateDragAndDrop = mousePositionDifference => {
    const mouseMove = calculateMouseMove(mousePositionDifference);
    component.onMouseDown(mouseMove.start);
    component.onMouseMove(mouseMove.end);
    component.onMouseUp();
  };

  const changeSize = (newSize, comp) => {
    const parent = ReactTestUtils.findRenderedComponentWithType(
      splitPane,
      comp
    );
    parent.setState({ size: newSize });
  };

  const assertClass = (comp, expectedClassName) => {
    expect(coerceFindDOMNode(comp).className).to.contain(
      expectedClassName,
      'Incorrect className'
    );
    return this;
  };

  return {
    assertOrientation(expectedOrientation) {
      expect(coerceFindDOMNode(component).className).to.contain(
        expectedOrientation,
        'Incorrect orientation'
      );
      return this;
    },

    assertSplitPaneClass(expectedClassName) {
      assertClass(component, expectedClassName);
    },

    assertPaneClasses(expectedTopPaneClass, expectedBottomPaneClass) {
      assertClass(findTopPane(), expectedTopPaneClass);
      assertClass(findBottomPane(), expectedBottomPaneClass);
    },

    assertTopPaneClasses(expectedTopPaneClass) {
      assertClass(findTopPane(), expectedTopPaneClass);
    },

    assertBottomPaneClasses(expectedBottomPaneClass) {
      assertClass(findBottomPane(), expectedBottomPaneClass);
    },

    assertPaneContents(expectedContents) {
      const panes = findPanes();
      const values = panes.map(pane => findDOMNode(pane).textContent);
      expect(values).to.eql(expectedContents, 'Incorrect contents for Pane');
      return this;
    },

    assertContainsResizer() {
      expect(findResizer().length).to.equal(
        1,
        'Expected the SplitPane to have a single Resizer'
      );
      expect(findPanes().length).to.equal(
        2,
        'Expected the SplitPane to have 2 panes'
      );
      return this;
    },

    assertPaneWidth(expectedWidth, pane = 'first') {
      return assertPaneStyles({ width: expectedWidth }, pane);
    },

    assertPaneHeight(expectedHeight, pane = 'first') {
      return assertPaneStyles({ height: expectedHeight }, pane);
    },

    assertResizeByDragging(mousePositionDifference, expectedStyle) {
      simulateDragAndDrop(mousePositionDifference);
      return assertPaneStyles(expectedStyle, component.props.primary);
    },

    assertResizeCallbacks(
      expectedDragStartedCallback,
      expectedDragFinishedCallback
    ) {
      simulateDragAndDrop(200);
      return assertCallbacks(
        expectedDragStartedCallback,
        expectedDragFinishedCallback
      );
    },

    assertSizePersists(comp) {
      const pane = 'first';
      changeSize(100, comp);
      assertPaneStyles({ width: '100px' }, pane);
      changeSize(undefined, comp);
      assertPaneStyles({ width: '100px' }, pane);
    },

    assertResizerClasses(expectedClass) {
      assertClass(findResizer()[0], expectedClass);
    },

    assertPrimaryPanelChange(newJsx, primaryPane, secondaryPane) {
      const primary = findPaneByOrder(primaryPane);
      const secondary = findPaneByOrder(secondaryPane);
      expect(primary.props.size).to.equal(50);
      expect(secondary.props.size).to.equal(undefined);
      updateComponent(newJsx);
      expect(primary.props.size).to.equal(undefined);
      expect(secondary.props.size).to.equal(50);
    },

    assertPaneWidthChange(newJsx, expectedWidth, pane = 'first') {
      updateComponent(newJsx);
      return assertPaneStyles({ width: expectedWidth }, pane);
    },
  };
};
