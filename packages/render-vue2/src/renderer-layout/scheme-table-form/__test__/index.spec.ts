import { createForm } from '@formlogic/render-core-vue2';
import { mount } from '@vue/test-utils';

import { TransformsSchema } from '@/transforms';

import SchemeTableForm from '../SchemeTableForm';
import metaSchema from './metaSchema';

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
