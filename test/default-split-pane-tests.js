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


describe('Plain divs', () => {

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
      .assertSizes(["1", "1"])
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
      .assertSizes(["1", "1", "1"])
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
      .assertSizes(["1", "1"])
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
      .assertSizes(["1", "1", "1"])
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
      .assertSizes(["200px", "1"])
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
      .assertSizes(["1", "200px"])
    ;
  });
});


describe('Minimum sizes', () => {

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
      .assertSizes(["1", "1"])
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
      .assertSizes(["1", "1"])
    ;
  });
});


describe('Maximum sizes', () => {

  it('first Pane has maximum size', () => {

    const jsx = (
      <SplitPane>
        <Pane maxSize="200px">one</Pane>
        <Pane>two</Pane>
      </SplitPane>
    );

    asserter(jsx, {width: 601})
      .assertOrientation('vertical')
      .assertNumberOfPanes(2)
      .assertNumberOfResizers(1)
      .assertSizes(["1", "1"])
    ;
  });

  it('second Pane has maximum size', () => {

    const jsx = (
      <SplitPane>
        <Pane>one</Pane>
        <Pane maxSize="200px">two</Pane>
      </SplitPane>
    );

    asserter(jsx, {width: 601})
      .assertOrientation('vertical')
      .assertNumberOfPanes(2)
      .assertNumberOfResizers(1)
      .assertSizes(["1", "1"])
    ;
  });
});


describe('Drag resizer', () => {

  describe('horizontal', () => {

    it('2 divs', () => {
      const jsx = (
        <SplitPane split="horizontal">
          <div>one</div>
          <div>two</div>
        </SplitPane>
      );

      asserter(jsx, {height: 601})
        .assertSizes(["1", "1"])
        .dragResizer(0, {y: -100})
        .assertSizes(["20000", "40000"])
      ;
    });

    it('2 Panes', () => {
      const jsx = (
        <SplitPane split="horizontal">
          <Pane>one</Pane>
          <Pane>two</Pane>
        </SplitPane>
      );

      asserter(jsx, {height: 601})
        .assertSizes(["1", "1"])
        .dragResizer(0, {y: -100})
        .assertSizes(["20000", "40000"])
      ;
    });

    it('2 Panes - resized all the way', () => {
      const jsx = (
        <SplitPane split="horizontal">
          <div>one</div>
          <div>two</div>
        </SplitPane>
      );

      asserter(jsx, {height: 601})
        .assertSizes(["1", "1"])
        .dragResizer(0, {y: 300})
        .assertSizes(["60000", "0"])
      ;
    });


    it('2 Panes - resize, max px size', () => {
      const jsx = (
        <SplitPane split="horizontal">
          <Pane maxSize="400px">one</Pane>
          <Pane>two</Pane>
        </SplitPane>
      );

      asserter(jsx, {height: 601})
        .assertSizes(["1", "1"])
        .dragResizer(0, {y: 300})
        .assertSizes(["40000", "20000"])
      ;
    });

    it('2 Panes - resize, min px size', () => {
      const jsx = (
        <SplitPane split="horizontal">
          <Pane minSize="200px">one</Pane>
          <Pane>two</Pane>
        </SplitPane>
      );

      asserter(jsx, {height: 601})
        .assertSizes(["1", "1"])
        .dragResizer(0, {y: -300})
        .assertSizes(["20000", "40000"])
      ;
    });
  });


  describe('vertical', () => {

    it('2 divs', () => {
      const jsx = (
        <SplitPane>
          <div>one</div>
          <div>two</div>
        </SplitPane>
      );

      asserter(jsx, {width: 601})
        .assertSizes(["1", "1"])
        .dragResizer(0, {x: 100})
        .assertSizes(["40000", "20000"])
      ;
    });

    it('2 Panes', () => {
      const jsx = (
        <SplitPane>
          <Pane>one</Pane>
          <Pane>two</Pane>
        </SplitPane>
      );

      asserter(jsx, {width: 601})
        .assertSizes(["1", "1"])
        .dragResizer(0, {x: 100})
        .assertSizes(["40000", "20000"])
      ;
    });

    it('2 Panes - resized all the way', () => {
      const jsx = (
        <SplitPane>
          <div>one</div>
          <div>two</div>
        </SplitPane>
      );

      asserter(jsx, {width: 601})
        .assertSizes(["1", "1"])
        .dragResizer(0, {x: 300})
        .assertSizes(["60000", "0"])
      ;
    });
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
        .assertSizes(["1", "1", "1", "1"])
        .dragResizer(0, {y: 50})
        .assertSizes(["15000", "5000", "10000", "10000"])
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
        .assertSizes(["1", "1", "1", "1"])
        .dragResizer(1, {y: 50})
        .assertSizes(["10000", "15000", "5000", "10000"])
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
        .assertSizes(["1", "1", "1", "1"])
        .dragResizer(2, {y: 50})
        .assertSizes(["10000", "10000", "15000", "5000"])
      ;
    });
  });

});
