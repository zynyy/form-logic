import { create } from '@storybook/theming';

import { addons } from '@storybook/manager-api';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'formlogic design vue3',
  }),
});
