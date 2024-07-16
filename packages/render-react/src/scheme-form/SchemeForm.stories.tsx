import SchemeForm from './index';
import { useCreateForm, useFormSchema } from '@/hooks';
import { useRef, useState } from 'react';
import { TransformsSchemaOptions } from '@/transforms';
import { Form, IFormProps } from '@formily/core';

import User_C from '../low-code-meta/model-page/user/User_C.json';
import User_Group_C from '../low-code-meta/model-page/user/User_Group_C.json';
import User_ArrayTable_C from '../low-code-meta/model-page/user/User_ArrayTable_C.json';
import User_Tabs_C from '../low-code-meta/model-page/user/User_Tabs_C.json';
import User_Object_C from '../low-code-meta/model-page/user/User_Object_C.json';
import EffectHookSelect from '@/components/constant-component/effect-hook-select';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'SchemeForm',
  component: SchemeForm,
  argTypes: {
    config: {
      description: 'meta schema render',
    },
  },
};

const Template = ({ hasGroup, pattern, metaSchema, ...args }) => {
  const [options] = useState<TransformsSchemaOptions>(() => {
    return {
      metaSchema: metaSchema,
      hasGroup: hasGroup,
      pattern: pattern,
    };
  });

  const [formConfig] = useState<IFormProps>(() => {
    return {
      initialValues: {},
    };
  });

  const { schema, buttons } = useFormSchema(options);

  const [form] = useCreateForm({
    formConfig
  });

  return (
    <>
      {buttons}
      <SchemeForm
        {...args}
        form={form}
        schema={schema}
        components={{
          Select: EffectHookSelect,
        }}
      />
    </>
  );
};

export const editable = Template.bind({});

editable.args = {
  metaSchema: User_C,
  pattern: 'EDITABLE',
};

export const disabled = Template.bind({});

disabled.args = {
  metaSchema: User_C,
  pattern: 'DISABLED',
};

export const DETAIL = Template.bind({});

DETAIL.args = {
  metaSchema: User_C,
  pattern: 'DETAIL',
};

export const noGroup = Template.bind({});

noGroup.args = {
  metaSchema: User_C,
  hasGroup: false,
};

export const group = Template.bind({});

group.args = {
  metaSchema: User_Group_C,
  hasGroup: true,
};

export const arrayTable = Template.bind({});

arrayTable.args = {
  metaSchema: User_ArrayTable_C,
  hasGroup: true,
};

export const tabs = Template.bind({});

tabs.args = {
  metaSchema: User_Tabs_C,
  hasGroup: true,
};

export const object = Template.bind({});

object.args = {
  metaSchema: User_Object_C,
  hasGroup: true,
};
