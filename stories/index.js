import React from 'react';
import { storiesOf } from '@storybook/react';

import BasicHorizontal from './BasicHorizontal';
import BasicNested from './BasicNested';
import BasicStep from './BasicStep';
import BasicVertical from './BasicVertical';
import PercentageHorizontal from './PercentageHorizontal';
import PercentageVertical from './PercentageVertical';
import SnapToPostion from './SnapToPosition';

import InlineStyles from './InlineStyles';
import MultipleHorizontal from './MultipleHorizontal';
import MultipleVertical from './MultipleVertical';
import NestedHorizontal from './NestedHorizontal';
import NestedVertical from './NestedVertical';
import Subcomponent from './Subcomponent';

import './index.css';

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
