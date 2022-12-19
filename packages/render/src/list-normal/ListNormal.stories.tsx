import ListNormal from './index';

import { useRef } from 'react';

import { Form } from '@formily/core';
import User_L from '@/low-code-meta/model-page/user/User_L.json';
import User_Collapsed_L from '@/low-code-meta/model-page/user/User_Collapsed_L.json';

export default {
  title: 'ListNormal',
  component: ListNormal,
  argTypes: {
    config: {
      description: 'meta schema render',
    },
  },
};

const Template = ({ metaSchema, ...args }) => {
  const formRef = useRef<Form>();

  return (
    <>
      <ListNormal {...args} metaSchema={metaSchema} ref={formRef} searchFormConfig={{}} />
    </>
  );
};

export const list = Template.bind({});

list.args = {
  metaSchema: User_L,
};

export const listCollapsed = Template.bind({});

listCollapsed.args = {
  metaSchema: User_Collapsed_L,
};
