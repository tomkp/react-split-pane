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
import { render, findDOMNode } from 'react-dom';

describe('Div panes', () => {

  describe('Defaults', () => {

    it('each Pane should have the same flex', () => {
      const jsx = (
        <SplitPane>
          <div>one</div>
          <div>two</div>
        </SplitPane>
      );

      asserter(jsx)
        .assertOrientation('vertical')
        .assertNumberOfPanes(2)
        .assertNumberOfResizers(1)
        .assertRatios([50, 50])
        .assertSizes([299.5, 299.5]);
    });

    it('each Pane should have the same flex', () => {
      const jsx = (
        <SplitPane>
          <div>one</div>
          <div>two</div>
          <div>three</div>
        </SplitPane>
      );

      asserter(jsx)
        .assertOrientation('vertical')
        .assertNumberOfPanes(3)
        .assertNumberOfResizers(2)
        .assertRatios([33, 33, 33])
        .assertSizes([199.33, 199.33, 199.33]);
    });
  });

  describe('Panes', () => {
    it('each Pane should have the same flex', () => {
      const jsx = (
        <SplitPane>
          <Pane>one</Pane>
          <Pane>two</Pane>
        </SplitPane>
      );

      asserter(jsx)
        .assertOrientation('vertical')
        .assertNumberOfPanes(2)
        .assertNumberOfResizers(1)
        .assertRatios([50, 50])
        .assertSizes([299.5, 299.5])
    });

    it('each Pane should have the same flex', () => {
      const jsx = (
        <SplitPane>
          <Pane>one</Pane>
          <Pane>two</Pane>
          <Pane>three</Pane>
        </SplitPane>
      );

      asserter(jsx)
        .assertOrientation('vertical')
        .assertNumberOfPanes(3)
        .assertNumberOfResizers(2)
        .assertRatios([33, 33, 33])
        .assertSizes([199.33, 199.33, 199.33]);
    });

    describe('initial sizes', () => {
      it('first pane', () => {
        const jsx = (
          <SplitPane>
            <Pane initialSize="250px">one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );

        asserter(jsx)
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertRatios([42, 58])
          .assertSizes([250, 349]);
      });

      it('second pane', () => {
        const jsx = (
          <SplitPane>
            <Pane>one</Pane>
            <Pane initialSize="250px">two</Pane>
          </SplitPane>
        );

        asserter(jsx)
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertRatios([58, 42])
          .assertSizes([349, 250]);
      });
    });

    describe('min sizes', () => {
      it('first pane', () => {
        const jsx = (
          <SplitPane>
            <Pane minSize="250px">one</Pane>
            <Pane>two</Pane>
          </SplitPane>
        );

        asserter(jsx)
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertRatios([50, 50])
          .assertSizes([299.5, 299.5]);
      });

      it('second pane', () => {
        const jsx = (
          <SplitPane>
            <Pane>one</Pane>
            <Pane minSize="250px">two</Pane>
          </SplitPane>
        );

        asserter(jsx)
          .assertOrientation('vertical')
          .assertNumberOfPanes(2)
          .assertNumberOfResizers(1)
          .assertMinSizes(['0px', '250px']);
      });
    });
  });

  describe('Drag resizer', () => {

    it('vertical panes', () => {
      const jsx = (
        <SplitPane>
          <div>one</div>
          <div>two</div>
        </SplitPane>
      );

      asserter(jsx)
        .assertOrientation('vertical')
        .assertNumberOfPanes(2)
        .assertNumberOfResizers(1)
        .assertSizes([299.5, 299.5])
        .dragResizer(0, {x:20, y:0})
        .assertSizes([319.5, 279.5]);
    });
  });
});
