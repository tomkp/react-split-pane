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

//.....
const tween = (from, to) => {
  let x0 = from.clientX;
  let y0 = from.clientY;
  let x1 = to.clientX;
  let y1 = to.clientY;

  let dots = [];
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let sx = (x0 < x1) ? 1 : -1;
  let sy = (y0 < y1) ? 1 : -1;
  let err = dx - dy;

  dots.push({ x: x0, y: y0 });

  while(!((x0 === x1) && (y0 === y1))) {
    let e2 = err << 1;

    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }

    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }

    dots.push({ clientX: x0, clientY: y0 });
  }

  return dots;
}



//.....

const renderComponent = jsx => {
  const testDiv = document.createElement('div');
  testDiv.setAttribute(
    'style',
    'margin:0; height: 600px; width: 600px; background: yellow;'
  );
  document.body.setAttribute(
    'style',
    'margin:0; padding: 0;'
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
    }
    if (mousePositionDifference.y) {
      mouseMove.end.clientY = resizerCoords.y + mousePositionDifference.y;
    }


    const movements = tween(mouseMove.start, mouseMove.end);
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
      const coordinates = calculateMouseMove(resizerIndex, mousePositionDifference);
      log(`coordinates`, coordinates);
      //component.onMouseDown(mouseMove.start, resizerIndex);
      //component.onMouseMove(mouseMove.end);

      const [start, ...rest] = coordinates;
      component.onMouseDown(start, resizerIndex);

      rest.forEach(coordinate => {
        console.log(`-> `, coordinate);
        component.onMouseMove(coordinate);
      });

      component.onMouseUp();
      return this;
    },
  };
};

export default asserter;