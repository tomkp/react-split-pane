import 'core-js/es6';

import React from 'react';
import SplitPane from '../src/SplitPane';
import Pane from '../src/Pane';
import Resizer from '../src/Resizer';
import asserter from './assertions/Asserter';
import {
  findRenderedComponentWithType,
  scryRenderedComponentsWithType,
} from 'react-dom/test-utils';
import {render, findDOMNode} from 'react-dom';


describe('divs', () => {

  it('2 divs', () => {
    const jsx = (
      <SplitPane>
        <div>one</div>
        <div>two</div>
      </SplitPane>
    );

    asserter(jsx, {width: 601})
      .assertOrientation('vertical')
      .assertNumberOfPanes(2)
      .assertNumberOfResizers(1)
      .assertRatios([50, 50])
      .assertSizes([300, 300])
    ;
  });

  it('3 divs', () => {
    const jsx = (
      <SplitPane>
        <div>one</div>
        <div>two</div>
        <div>three</div>
      </SplitPane>
    );

    asserter(jsx, {width: 602})
      .assertOrientation('vertical')
      .assertNumberOfPanes(3)
      .assertNumberOfResizers(2)
      .assertRatios([33, 33, 33])
      .assertSizes([200, 200, 200])
    ;
  });
});


describe('Panes', () => {

  it('2 Panes', () => {
    const jsx = (
      <SplitPane>
        <Pane>one</Pane>
        <Pane>two</Pane>
      </SplitPane>
    );

    asserter(jsx, {width: 601})
      .assertOrientation('vertical')
      .assertNumberOfPanes(2)
      .assertNumberOfResizers(1)
      .assertRatios([50, 50])
      .assertSizes([300, 300])
    ;
  });


  it('3 Panes', () => {
    const jsx = (
      <SplitPane>
        <Pane>one</Pane>
        <Pane>two</Pane>
        <Pane>three</Pane>
      </SplitPane>
    );

    asserter(jsx, {width: 602})
      .assertOrientation('vertical')
      .assertNumberOfPanes(3)
      .assertNumberOfResizers(2)
      .assertRatios([33, 33, 33])
      .assertSizes([200, 200, 200])
    ;
  });
});


describe('Initial sizes', () => {

  it('first Pane has initial size', () => {
    const jsx = (
      <SplitPane>
        <Pane initialSize="200px">one</Pane>
        <Pane>two</Pane>
      </SplitPane>
    );

    asserter(jsx, {width: 601})
      .assertOrientation('vertical')
      .assertNumberOfPanes(2)
      .assertNumberOfResizers(1)
      .assertSizes([200, 400])
      .assertRatios([33, 67])
    ;
  });

  it('second Pane has initial size', () => {
    const jsx = (
      <SplitPane>
        <Pane>one</Pane>
        <Pane initialSize="200px">two</Pane>
      </SplitPane>
    );

    asserter(jsx, {width: 601})
      .assertOrientation('vertical')
      .assertNumberOfPanes(2)
      .assertNumberOfResizers(1)
      .assertSizes([400, 200])
      .assertRatios([67, 33])
    ;
  });
});


describe('min sizes', () => {

  it('first Pane has minimum size', () => {

    const jsx = (
      <SplitPane>
        <Pane minSize="200px">one</Pane>
        <Pane>two</Pane>
      </SplitPane>
    );

    asserter(jsx, {width: 601})
      .assertOrientation('vertical')
      .assertNumberOfPanes(2)
      .assertNumberOfResizers(1)
      .assertSizes([300, 300])
      .assertRatios([50, 50])
    ;
  });

  it('second Pane has minimum size', () => {

    const jsx = (
      <SplitPane>
        <Pane>one</Pane>
        <Pane minSize="200px">two</Pane>
      </SplitPane>
    );

    asserter(jsx, {width: 601})
      .assertOrientation('vertical')
      .assertNumberOfPanes(2)
      .assertNumberOfResizers(1)
      .assertSizes([300, 300])
      .assertRatios([50, 50])
    ;
  });
});


describe('Drag resizer', () => {

  it('vertical divs', () => {
    const jsx = (
      <SplitPane>
        <div>one</div>
        <div>two</div>
      </SplitPane>
    );

    asserter(jsx, {width: 601})
      .assertRatios([50, 50])
      .assertSizes([300, 300])
      .dragResizer(0, {x: 100})
      .assertSizes([400, 200])
      .assertRatios([67, 33])
    ;
  });

  it('horizontal divs', () => {
    const jsx = (
      <SplitPane split="horizontal">
        <div>one</div>
        <div>two</div>
      </SplitPane>
    );

    asserter(jsx, {height: 601})
      .assertRatios([50, 50])
      .assertSizes([300, 300])
      .dragResizer(0, {y: -100})
      .assertSizes([200, 400])
      .assertRatios([33, 67])
    ;
  });

  it('vertical Panes', () => {
    const jsx = (
      <SplitPane>
        <Pane>one</Pane>
        <Pane>two</Pane>
      </SplitPane>
    );

    asserter(jsx, {width: 601})
      .assertRatios([50, 50])
      .assertSizes([300, 300])
      .dragResizer(0, {x: 100})
      .assertSizes([400, 200])
      .assertRatios([67, 33])
    ;
  });

  it('horizontal Panes', () => {
    const jsx = (
      <SplitPane split="horizontal">
        <Pane>one</Pane>
        <Pane>two</Pane>
      </SplitPane>
    );

    asserter(jsx, {height: 601})
      .assertRatios([50, 50])
      .assertSizes([300, 300])
      .dragResizer(0, {y: -100})
      .assertSizes([200, 400])
      .assertRatios([33, 67])
    ;
  });

  it('vertical Panes - resized all the way', () => {
    const jsx = (
      <SplitPane>
        <div>one</div>
        <div>two</div>
      </SplitPane>
    );

    asserter(jsx, {width: 601})
      .assertRatios([50, 50])
      .assertSizes([300, 300])
      .dragResizer(0, {x: 300})
      .assertSizes([600, 0])
      .assertRatios([100, 0])
    ;
  });

  it('horizontal Panes - resized all the way', () => {
    const jsx = (
      <SplitPane split="horizontal">
        <div>one</div>
        <div>two</div>
      </SplitPane>
    );

    asserter(jsx, {height: 601})
      .assertRatios([50, 50])
      .assertSizes([300, 300])
      .dragResizer(0, {y: 300})
      .assertSizes([600, 0])
      .assertRatios([100, 0])
    ;
  });


  it('horizontal Panes - resize, max px size', () => {
    const jsx = (
      <SplitPane split="horizontal">
        <Pane maxSize="400px">one</Pane>
        <Pane>two</Pane>
      </SplitPane>
    );

    asserter(jsx, {height: 601})
      .assertRatios([50, 50])
      .assertSizes([300, 300])
      .dragResizer(0, {y: 300})
      .assertSizes([400, 200])
      .assertRatios([67, 33])
    ;
  });

  it('horizontal Panes - resize, min px size', () => {
    const jsx = (
      <SplitPane split="horizontal">
        <Pane minSize="200px">one</Pane>
        <Pane>two</Pane>
      </SplitPane>
    );

    asserter(jsx, {height: 601})
      .assertRatios([50, 50])
      .assertSizes([300, 300])
      .dragResizer(0, {y: -300})
      .assertSizes([200, 400])
      .assertRatios([33, 67])
    ;
  });


  describe('multiple horizontal Panes', () => {

    it('first resizer', () => {

      const jsx = (
        <SplitPane split="horizontal">
          <Pane>one</Pane>
          <Pane>two</Pane>
          <Pane>three</Pane>
          <Pane>four</Pane>
        </SplitPane>
      );

      asserter(jsx, {height: 403})
        .assertRatios([25, 25, 25, 25])
        .assertSizes([100, 100, 100, 100])
        .dragResizer(0, {y: 50})
        .assertSizes([150, 50, 100, 100])
        .assertRatios([37, 12, 25, 25])
      ;
    });

    it('second resizer', () => {

      const jsx = (
        <SplitPane split="horizontal">
          <Pane>one</Pane>
          <Pane>two</Pane>
          <Pane>three</Pane>
          <Pane>four</Pane>
        </SplitPane>
      );

      asserter(jsx, {height: 403})
        .assertRatios([25, 25, 25, 25])
        .assertSizes([100, 100, 100, 100])
        .dragResizer(1, {y: 50})
        .assertSizes([100, 150, 50, 100])
        .assertRatios([25, 37, 12, 25])
      ;
    });

    it('third resizer', () => {

      const jsx = (
        <SplitPane split="horizontal">
          <Pane>one</Pane>
          <Pane>two</Pane>
          <Pane>three</Pane>
          <Pane>four</Pane>
        </SplitPane>
      );

      asserter(jsx, {height: 403})
        .assertRatios([25, 25, 25, 25])
        .assertSizes([100, 100, 100, 100])
        .dragResizer(2, {y: 50})
        .assertSizes([100, 100, 150, 50])
        .assertRatios([25, 25, 37, 12])
      ;
    });
  });

});
