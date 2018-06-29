import React from 'react';
import styled from 'react-emotion';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import Sidebar from './components/Sidebar';

// basic examples
import BasicHorizontal from './examples/basic/BasicHorizontal';
import BasicNested from './examples/basic/BasicNested';
import BasicStep from './examples/basic/BasicStep';
import BasicVertical from './examples/basic/BasicVertical';
import PercentageHorizontal from './examples/basic/PercentageHorizontal';
import PercentageVertical from './examples/basic/PercentageVertical';
import SnapToPostion from './examples/basic/SnapToPosition';

// advanced examples
import InlineStyles from './examples/advanced/InlineStyles';
import MultipleHorizontal from './examples/advanced/MultipleHorizontal';
import MultipleVertical from './examples/advanced/MultipleVertical';
import NestedHorizontal from './examples/advanced/NestedHorizontal';
import NestedVertical from './examples/advanced/NestedVertical';
import Subcomponent from './examples/advanced/Subcomponent';

const Wrapper = styled('div')`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

const Container = styled('div')`
  width: 100%;
  height: 100%;
`;

export default function App() {
  return (
    <BrowserRouter>
      <Wrapper>
        <Sidebar />
        <Container>
          <Route
            exact
            path="/"
            render={() => <Redirect to="/basic-horizontal" />}
          />
          <Route exact path="/basic-horizontal" component={BasicHorizontal} />
          <Route exact path="/basic-vertical" component={BasicVertical} />
          <Route exact path="/basic-step" component={BasicStep} />
          <Route exact path="/basic-nested" component={BasicNested} />
          <Route
            exact
            path="/percentage-vertical"
            component={PercentageVertical}
          />
          <Route
            exact
            path="/percentage-horizontal"
            component={PercentageHorizontal}
          />
          <Route exact path="/snap-position" component={SnapToPostion} />
          <Route exact path="/inline-styles" component={InlineStyles} />
          <Route exact path="/multiple-vertical" component={MultipleVertical} />
          <Route
            exact
            path="/multiple-horizontal"
            component={MultipleHorizontal}
          />
          <Route exact path="/nested-vertical" component={NestedVertical} />
          <Route exact path="/nested-horizontal" component={NestedHorizontal} />
          <Route exact path="/subcomponent" component={Subcomponent} />
        </Container>
      </Wrapper>
    </BrowserRouter>
  );
}
