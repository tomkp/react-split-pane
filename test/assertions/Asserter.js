import React from 'react';
import SplitPane from '../../src/SplitPane';
import Pane from '../../src/Pane';
import Resizer from '../../src/Resizer';
import {
  findRenderedComponentWithType,
  scryRenderedComponentsWithType,
} from 'react-dom/test-utils';
import { findDOMNode } from 'react-dom';
import chai from 'chai';

import {calculatePointsBetween, getCentre, renderComponent, unmountComponent} from '../lib/utils';

const expect = chai.expect;

const debug = false;

const log = (...args) => {
  if (debug) console.log(...['Asserter', ...args]);
};





//.....


const asserter = (jsx, dimensions = {}) => {
  const splitPane = renderComponent(jsx, dimensions);
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
    }
    if (mousePositionDifference.y) {
      mouseMove.end.clientY = resizerCoords.y + mousePositionDifference.y;
    }

    const movements = calculatePointsBetween(mouseMove.start, mouseMove.end);
    //console.log(`movements`, movements);
    //return mouseMove;
    return movements;
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
      const actualSizes = panes.map(_ => _.props['size']);
      expect(actualSizes).to.eql(expected, 'Unexpected sizes');
      return this;
    },
    assertSizesPx(expected) {
      const panes = scryRenderedComponentsWithType(component, Pane);
      const actualSizes = panes.map(_ => {
        const sizeProp = component.props['split'] === 'vertical' ? 'width' : 'height';
        return findDOMNode(_).getBoundingClientRect()[sizeProp];
      });
      expect(actualSizes).to.eql(expected, 'Unexpected sizes in px');
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
    dragResizer(resizerIndex, mousePositionDifference, mouseRightClick = false) {
      const coordinates = calculateMouseMove(resizerIndex, mousePositionDifference);
      const [startPosition, ...moveCoordinates] = coordinates;
      const event = {
        preventDefault(){},
        button: mouseRightClick ? 1 : 0,
        ...startPosition
      };

      component.onMouseDown(event, resizerIndex);
      moveCoordinates.forEach(coordinate => component.onMouseMove({...coordinate, preventDefault(){}}));
      component.onMouseUp(event);
      return this;
    },
  };
};

asserter.unmountComponent = unmountComponent;

export default asserter;