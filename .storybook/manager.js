import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'React Split Pane',
    brandUrl: 'https://github.com/tomkp/react-split-pane',
    gridCellSize: 12,
  }),
});
