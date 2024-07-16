import { createForm, Form } from '@formlogic/render-core-vue3';
import { mount } from '@vue/test-utils';

import { TransformsSchema } from '@/transforms';

import SchemeForm from '../SchemeForm';

let form: Form = null;

import { ISchema } from '@formlogic/render-core-vue3';

import metaSchema from './metaSchema';

let schema: ISchema = null;
describe('scheme-form', () => {
  let wrapper;

  beforeEach(() => {
    form = createForm();

    const formSchema = new TransformsSchema({
      metaSchema,
    }).getFormSchema();

    schema = formSchema.schema;

    wrapper = mount(SchemeForm, {
      props: {
        form,
        schema,
      },
    });
  });

  test(' gen snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
