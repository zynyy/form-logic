import JsonPopover from './index';

import { useState } from 'react';
import { IFormProps } from '@formily/core';

import Api_C from '@/low-code-meta/model-page/Api/Api_C.json';
import FormPageLayout from '@/form-page-layout';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'JsonPopover',
  component: JsonPopover,
  argTypes: {
    config: {
      description: 'meta schema render',
    },
  },
};

const Template = ({ ...args }) => {
  const [formConfig] = useState<IFormProps>(() => {
    return {
      initialValues: {
        params: {
          demo: 1,
        },
      },
    };
  });

  return (
    <>
      <FormPageLayout
        getLogicConfig={function (code: string): Promise<any> {
          throw new Error('Function not implemented.');
        }}
        {...args}
        formConfig={formConfig}
        components={{ JsonPopover }}
      />
    </>
  );
};

export const editable = Template.bind({});

editable.args = {
  metaSchema: Api_C,
  pattern: 'EDITABLE',
};

export const disabled = Template.bind({});

disabled.args = {
  metaSchema: Api_C,
  pattern: 'DISABLED',
};

export const DETAIL = Template.bind({});

DETAIL.args = {
  metaSchema: Api_C,
  pattern: 'DETAIL',
};
