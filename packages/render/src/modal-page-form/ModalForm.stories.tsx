import ModalForm from './index';

import { useEffect, useState } from 'react';
import { TransformsSchemaOptions } from '@/transforms';
import { IFormProps } from '@formily/core';

import User_C from '../low-code-meta/model-page/user/User_C.json';
import User_Group_C from '../low-code-meta/model-page/user/User_Group_C.json';
import User_ArrayTable_C from '../low-code-meta/model-page/user/User_ArrayTable_C.json';
import User_Tabs_C from '../low-code-meta/model-page/user/User_Tabs_C.json';
import { useOpen } from '@/hooks';
import getLogicConfig from '@/low-code-meta/logic';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'ModalForm',
  component: ModalForm,
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

  const [open, show, hidden] = useOpen();

  const [formConfig] = useState<IFormProps>(() => {
    return {
      initialValues: {},
    };
  });

  useEffect(() => {
    setTimeout(() => {
      show();
    }, 2000);
  }, []);

  return (
    <>
      <ModalForm getLogicConfig={getLogicConfig} {...args} options={options} open={open} formConfig={formConfig} onClose={hidden} />
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
