import { Fragment } from '@formlogic/render-core-vue2';

import { pluginFactory } from '@/utils/plugins';

import { SchemeForm, SchemeTableForm } from './renderer-layout';

export const install = pluginFactory({
  components: {
    SchemeForm,
    SchemeTableForm,
    Fragment,
  },
});
