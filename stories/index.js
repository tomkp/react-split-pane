import React from 'react';
import { storiesOf } from '@storybook/react';

import BasicHorizontal from '../stories/BasicHorizontal';
import BasicNested from './examples/basic/BasicNested';
import BasicStep from '../stories/BasicStep';
import BasicVertical from '../stories/BasicVertical';
import PercentageHorizontal from '../stories/PercentageHorizontal';
import PercentageVertical from '../stories/PercentageVertical';
import SnapToPostion from './examples/basic/SnapToPosition';

import InlineStyles from './InlineStyles';
import MultipleHorizontal from './MultipleHorizontal';
import MultipleVertical from './MultipleVertical';
import NestedHorizontal from './NestedHorizontal';
import NestedVertical from './NestedVertical';
import Subcomponent from './Subcomponent';

storiesOf('Basic', module)
  .add('Basic Horizontal', () => <BasicHorizontal />)
  .add('Basic Nested', () => <BasicNested />)
  .add('Basic Step', () => <BasicStep />)
  .add('Basic Vertical', () => <BasicVertical />)
  .add('Percentage Horizontal', () => <PercentageHorizontal />)
  .add('Percentage Vertical', () => <PercentageVertical />)
  .add('Snap To Position', () => <SnapToPostion />);

storiesOf('Advanced', module)
  .add('Inline Styles', () => <InlineStyles />)
  .add('Multiple Horizontal', () => <MultipleHorizontal />)
  .add('Multiple Vertical', () => <MultipleVertical />)
  .add('Nested Horizontal', () => <NestedHorizontal />)
  .add('Nested Vertical', () => <NestedVertical />)
  .add('Subcomponent', () => <Subcomponent />);
