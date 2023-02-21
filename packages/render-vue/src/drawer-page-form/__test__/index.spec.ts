import { mount } from '@vue/test-utils';

import DrawerPageForm from '../DrawerPageForm';

import metaSchema from './metaSchema';

describe('drawer-page-form ', () => {
  let wrapper;
  let drawerPageForm;

  beforeEach(() => {
    wrapper = mount(DrawerPageForm, {
      props: {
        visible: true,
        options: {
          metaSchema,
          hasGroup: true,
        },
        getLogicConfig: () => {
          return Promise.resolve();
        },
        formConfig: {},
      },
    });

    drawerPageForm = wrapper.getComponent(DrawerPageForm);
  });

  test('gen snapshot', async () => {
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});
