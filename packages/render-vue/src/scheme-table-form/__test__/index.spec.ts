import { mount } from '@vue/test-utils';

import SchemeTableForm from '../SchemeTableForm';

import metaSchema from './metaSchema';
import { createForm } from '@formily/core';
import { TransformsSchema } from '@/transforms';

describe('schema table form ', () => {
  let wrapper;

  beforeEach(() => {
    const listSchema = new TransformsSchema({ metaSchema }).getListSchema();

    wrapper = mount(SchemeTableForm, {
      props: {
        schema: listSchema.tableSchema,
        form: createForm(),
      },
    });
  });

  test('gen snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('gen data snapshot', async () => {
    await wrapper.setProps({
      dataSource: [{ code: 'test snapshot', name: '测试生成快照' }],
      pageSize: 30,
      currentPage: 1,
      total: 20,
      rowKey: 'code',
    });

    await wrapper.vm.$forceUpdate();

    expect(wrapper.html()).toMatchSnapshot();
  });
});
