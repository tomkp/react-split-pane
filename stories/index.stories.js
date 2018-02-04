import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import SplitPane from '../lib/SplitPane';
import Pane from "../lib/Pane";

import { Button, Welcome } from '@storybook/react/demo';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Vertical', module)
  .add('with divs', () =>
    <SplitPane split="vertical">
      <div>This is a div</div>
      <div>This is a div</div>
    </SplitPane>
  )
  .add('with Panes', () =>
    <SplitPane split="vertical">
      <Pane>This is a Pane</Pane>
      <Pane>This is a Pane</Pane>
    </SplitPane>
  );

storiesOf('Horizontal', module)
  .add('with divs', () =>
    <SplitPane split="horizontal">
      <div>This is a div</div>
      <div>This is a div</div>
    </SplitPane>
  )
  .add('with Panes', () =>
    <SplitPane split="horizontal">
      <Pane>This is a Pane</Pane>
      <Pane>This is a Pane</Pane>
    </SplitPane>
  );
