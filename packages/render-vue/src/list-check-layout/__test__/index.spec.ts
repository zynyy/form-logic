import { mount } from '@vue/test-utils';

import ListCheckLayout from '../ListCheckLayout';

import metaSchema from './metaSchema';

describe('list check layout ', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ListCheckLayout, {
      props: {
        metaSchema,
        action: '/',
        getLogicConfig: () => {
          return Promise.resolve();
        },
      },
    });
  });

  test('gen snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
