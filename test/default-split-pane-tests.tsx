import React, { StrictMode } from 'react';
import chai from 'chai';
import spies from 'chai-spies';

import SplitPane from '../src/SplitPane';
import asserter from './assertions/Asserter';

chai.use(spies);

describe('Default SplitPane', () => {
  const splitPane = (
    <SplitPane>
      <div>one</div>
      <div>two</div>
    </SplitPane>
  );

  it('should render the child panes', () => {
    asserter(splitPane).assertPaneContents(['one', 'two']);
  });

  it('should have vertical orientation', () => {
    asserter(splitPane).assertOrientation('vertical');
  });

  it('should contain a Resizer', () => {
    asserter(splitPane).assertContainsResizer();
  });
});

describe('SplitPane can have a specific class', () => {
  const splitPane = (
    <SplitPane className="some-class">
      <div>one</div>
      <div>two</div>
    </SplitPane>
  );

  it('should have the specified class', () => {
    asserter(splitPane).assertSplitPaneClass('some-class');
  });
});

describe('SplitPane can have resizing callbacks', () => {
  const onDragStartedCallback = chai.spy(() => {});
  const onDragFinishedCallback = chai.spy(() => {});

  const splitPane = (
    <SplitPane
      className="some-class"
      onDragStarted={onDragStartedCallback}
      onDragFinished={onDragFinishedCallback}
    >
      <div>one</div>
      <div>two</div>
    </SplitPane>
  );

  it('should call callbacks on resizing', () => {
    asserter(splitPane).assertResizeCallbacks(
      onDragStartedCallback,
      onDragFinishedCallback
    );
  });
});

describe('Internal Panes have class', () => {
  const splitPane = (
    <SplitPane paneClassName="some-class">
      <div>one</div>
      <div>two</div>
    </SplitPane>
  );

  it('should have the specified classname', () => {
    asserter(splitPane).assertPaneClasses('some-class', 'some-class');
  });

  it('should have the default classname', () => {
    asserter(splitPane).assertPaneClasses('Pane1', 'Pane2');
  });
});

describe('Top/Left Pane have class', () => {
  const splitPane = (
    <SplitPane pane1ClassName="some-class">
      <div>one</div>
      <div>two</div>
    </SplitPane>
  );

  it('should have the specified classname', () => {
    asserter(splitPane).assertTopPaneClasses('some-class');
  });

  it('should have the default classname', () => {
    asserter(splitPane).assertTopPaneClasses('Pane1');
  });
});

describe('Bottom/Right Pane have class', () => {
  const splitPane = (
    <SplitPane pane2ClassName="some-class">
      <div>one</div>
      <div>two</div>
    </SplitPane>
  );

  it('should have the specified classname', () => {
    asserter(splitPane).assertBottomPaneClasses('some-class');
  });

  it('should have the default classname', () => {
    asserter(splitPane).assertBottomPaneClasses('Pane2');
  });
});

describe('Internal Resizer have class', () => {
  const splitPane = (
    <SplitPane resizerClassName="some-class">
      <div>one</div>
      <div>two</div>
    </SplitPane>
  );

  it('should have the specified classname', () => {
    asserter(splitPane).assertResizerClasses('some-class');
  });

  it('should have the default classname', () => {
    asserter(splitPane).assertResizerClasses('Resizer');
  });
});

describe('Component updates', () => {
  const splitPane1 = (
    <SplitPane primary="first">
      <div>one</div>
      <div>two</div>
    </SplitPane>
  );
  const splitPane2 = (
    <SplitPane primary="second">
      <div>one</div>
      <div>two</div>
    </SplitPane>
  );
  it('unsets the width on the non-primary panel when first', () => {
    asserter(splitPane1).assertPrimaryPanelChange(
      splitPane2,
      'first',
      'second'
    );
  });

  it('unsets the width on the non-primary panel when second', () => {
    asserter(splitPane2).assertPrimaryPanelChange(
      splitPane1,
      'second',
      'first'
    );
  });

  it('updates the width of first panel when updating size, in strict mode (#309)', () => {
    // For some reason StrictMode renders to null if it is the root of the jsx,
    // and we also need the root to be a class-based component. So this is just a complicated
    // way of getting around this problem.
    class Div extends React.Component {
      render() {
        return <div>{this.props.children}</div>;
      }
    }
    const paneWithWidth = size => (
      <Div>
        <StrictMode>
          <SplitPane primary="first" size={size}>
            <div>one</div>
            <div>two</div>
          </SplitPane>
        </StrictMode>
      </Div>
    );

    asserter(paneWithWidth(100)).assertPaneWidthChange(
      paneWithWidth(200),
      '200px'
    );
  });
});
