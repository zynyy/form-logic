import { mount } from '@vue/test-utils';

import ListLayout from '../ListLayout';

import metaSchema from './metaSchema';

describe('list layout', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ListLayout, {
      props: {
        metaSchema,
        getLogicConfig: () => {
          return Promise.resolve();
        },
        action: '/',
      },
    });
  });

  test('gen snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
