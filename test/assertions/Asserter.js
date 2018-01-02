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

const debug = true;

const log = (...args) => {
  if (debug) console.log(...['Asserter', ...args]);
};


const renderComponent = jsx => {
  const testDiv = document.createElement('div');
  testDiv.setAttribute(
    'style',
    'height: 600px; width: 600px; background: yellow;'
  );
  document.body.appendChild(testDiv);
  const component = render(jsx, testDiv);
  log(`rendered Component`);
  return component;
};

const logStyles = _ => {
  log(`log styles for `, _);
  const style = findDOMNode(_).style;
  Object.keys(style).forEach(key => {
    const value = style[key];
    if (value) log(key, `->`, value);
  });
};

const logProps = _ => {
  log(_.props);
};

const getCentre = (dimensions) => {
  return {
    x: (dimensions.left + ((dimensions.right - dimensions.left) / 2)),
    y: (dimensions.top + ((dimensions.bottom - dimensions.top) / 2))
  };
};

const asserter = jsx => {
  const splitPane = renderComponent(jsx);
  const component = findRenderedComponentWithType(splitPane, SplitPane);

  const findPanes = () => {
    log(`findPanes`);
    const components = scryRenderedComponentsWithType(component, Pane);
    components.forEach(_ =>
      log(findDOMNode(_).getBoundingClientRect())
    );
    return components;
  };

  const findResizers = () => {
    log(`findResizers`);
    const components = scryRenderedComponentsWithType(component, Resizer);
    components.forEach(_ =>
      log(findDOMNode(_).getBoundingClientRect())
    );
    return components;
  };

  const getResizerBoundingRect = (resizerIndex) => {
    const resizerNode = findDOMNode(findResizers()[resizerIndex]);
    return resizerNode.getBoundingClientRect();
  };

  const calculateMouseMove = (resizerIndex, mousePositionDifference) => {
    log(`calculateMouseMove`, resizerIndex, mousePositionDifference);
    const resizerPosition = getResizerBoundingRect(resizerIndex);
    const resizerCoords = getCentre(resizerPosition);
    const mouseMove = {
      start: {
        clientX: resizerCoords.x,
        clientY: resizerCoords.y,
      },
      end: {
        clientX: resizerCoords.x,
        clientY: resizerCoords.y,
      },
    };
    if (mousePositionDifference.x) {
      mouseMove.end.clientX = resizerCoords.x + mousePositionDifference.x;
    } else if (mousePositionDifference.y) {
      mouseMove.end.clientY = resizerCoords.y + mousePositionDifference.y;
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
    dragResizer(resizerIndex, mousePositionDifference) {
      const mouseMove = calculateMouseMove(resizerIndex, mousePositionDifference);
      log(`mouseMove`, mouseMove);
      component.onMouseDown(mouseMove.start, resizerIndex);
      component.onMouseMove(mouseMove.end);
      component.onMouseUp();
      return this;
    },
  };
};

export default asserter;