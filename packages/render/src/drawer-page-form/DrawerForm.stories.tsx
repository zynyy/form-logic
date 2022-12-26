import DrawerForm from './index';
import { useFormSchema } from '@/hooks';
import { useRef, useState } from 'react';
import { TransformsSchemaOptions } from '@/transforms';
import { Form, IFormProps } from '@formily/core';

import User_C from '../low-code-meta/model-page/user/User_C.json';
import User_Group_C from '../low-code-meta/model-page/user/User_Group_C.json';
import User_ArrayTable_C from '../low-code-meta/model-page/user/User_ArrayTable_C.json';
import User_Tabs_C from '../low-code-meta/model-page/user/User_Tabs_C.json';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'DrawerForm',
  component: DrawerForm,
  argTypes: {
    config: {
      description: 'meta schema render',
    },
  },
};

const Template = ({ hasGroup, schemaMode, metaSchema, ...args }) => {
  const [options] = useState<TransformsSchemaOptions>(() => {
    return {
      metaSchema: metaSchema,
      hasGroup: hasGroup,
      schemaMode: schemaMode,
      buttonsEvent: {},
      logic: {},
    };
  });

  const [formConfig] = useState<IFormProps>(() => {
    return {
      initialValues: {},
    };
  });

  return (
    <>
      <DrawerForm {...args} options={options} open formConfig={formConfig} />
    </>
  );
};

export const editable = Template.bind({});

editable.args = {
  metaSchema: User_C,
  schemaMode: 'EDITABLE',
};

export const disabled = Template.bind({});

disabled.args = {
  metaSchema: User_C,
  schemaMode: 'DISABLED',
};

export const DETAIL = Template.bind({});

DETAIL.args = {
  metaSchema: User_C,
  schemaMode: 'DETAIL',
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
