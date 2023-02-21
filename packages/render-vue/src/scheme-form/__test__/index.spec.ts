import { mount } from '@vue/test-utils';

import SchemeForm from '../SchemeForm';
import { createForm, Form } from '@formily/core';
import { TransformsSchema } from '@/transforms';

let form: Form = null;

import metaSchema from './metaSchema';
import { ISchema } from '@formily/json-schema';

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
