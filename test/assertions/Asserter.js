import React from 'react';
import SplitPane from '../../src/SplitPane';
import Pane from '../../src/Pane';
import Resizer from '../../src/Resizer';
import {
  findRenderedComponentWithType,
  scryRenderedComponentsWithType,
} from 'react-dom/test-utils';
import { render, findDOMNode } from 'react-dom';
import chai from 'chai';

const expect = chai.expect;

const renderComponent = jsx => {
  const testDiv = document.createElement('div');
  testDiv.setAttribute(
    'style',
    'height: 600px; width: 600px; background: yellow;'
  );
  document.body.appendChild(testDiv);
  const component = render(jsx, testDiv);
  console.log(`rendered Component`);
  return component;
};

const logStyles = _ => {
  console.log(`log styles for `, _);
  const style = findDOMNode(_).style;
  Object.keys(style).forEach(key => {
    const value = style[key];
    if (value) console.log(key, `->`, value);
  });
};

const logProps = _ => {
  console.log(_.props);
};

const asserter = jsx => {
  const splitPane = renderComponent(jsx);
  const component = findRenderedComponentWithType(splitPane, SplitPane);

  const findPanes = () => {
    console.log(`findPanes`);
    const components = scryRenderedComponentsWithType(component, Pane);
    components.forEach(_ =>
      console.log(findDOMNode(_).getBoundingClientRect())
    );
    return components;
  };

  const findResizers = () => {
    console.log(`findResizers`);
    const components = scryRenderedComponentsWithType(component, Resizer);
    components.forEach(_ =>
      console.log(findDOMNode(_).getBoundingClientRect())
    );
    return components;
  };

  const getResizerPosition = () => {
    console.log(`getResizerPosition`);
    const resizerNode = findDOMNode(findResizers()[0]);
    //console.log(`resizerNode`, resizerNode);
    return resizerNode.getBoundingClientRect();
  };

  const calculateMouseMove = mousePositionDifference => {
    console.log(`calculateMouseMove`);
    const resizerPosition = getResizerPosition();
    console.log(`resizerPosition`, resizerPosition);
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

  return {
    assertNumberOfPanes(expected) {
      const panes = findPanes();
      expect(panes.length).to.equal(expected, 'Unexpected number of panes');
      return this;
    },
    assertNumberOfResizers(expected) {
      const resizers = findResizers();
      expect(resizers.length).to.equal(
        expected,
        'Unexpected number of resizers'
      );
      return this;
    },
    assertOrientation(expected) {
      expect(component.props['split']).to.eql(
        expected,
        'Unexpected split orientation'
      );
      return this;
    },
    assertRatios(expected) {
      const panes = scryRenderedComponentsWithType(component, Pane);
      const actualSizes = panes.map(_ => +_.props['ratio']);
      expect(actualSizes).to.eql(expected, 'Unexpected ratios');
      return this;
    },
    assertSizes(expected) {
      const panes = scryRenderedComponentsWithType(component, Pane);
      const actualSizes = panes.map(_ => +_.props['size']);
      expect(actualSizes).to.eql(expected, 'Unexpected sizes');
      return this;
    },

    // todo - are these relevant?
    assertMinSizes(expected) {
      const panes = scryRenderedComponentsWithType(component, Pane);
      const actualSizes = panes.map(_ => _.props['minSize']);
      expect(actualSizes).to.eql(expected, 'Unexpected min size');
      return this;
    },
    assertMaxSizes(expected) {
      const panes = scryRenderedComponentsWithType(component, Pane);
      const actualSizes = panes.map(_ => _.props['maxSize']);
      expect(actualSizes).to.eql(expected, 'Unexpected max size');
      return this;
    },

    assertFlexSizes(expectedSizes) {
      const panes = scryRenderedComponentsWithType(component, Pane);
      const actualSizes = panes.map(_ => +findDOMNode(_).style.flexGrow);
      expect(actualSizes).to.eql(expectedSizes, 'Unexpected flex sizes');
      return this;
    },
    simulateDragAndDrop(mousePositionDifference) {
      const mouseMove = calculateMouseMove(mousePositionDifference);
      component.onMouseDown(mouseMove.start);
      component.onMouseMove(mouseMove.end);
      component.onMouseUp();
    },
  };
};

export default asserter;