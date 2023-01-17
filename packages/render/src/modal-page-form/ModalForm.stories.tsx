import ModalForm from './index';
import { useJsonMetaSchema, useOpen } from '@/hooks';
import { useEffect, useState } from 'react';
import { IFormProps } from '@formily/core';

import getLogicConfig from '@/low-code-meta/logic';

import { requestGet } from '@/utils/request';

import ModelPage_U from '@/low-code-meta/model-page/ModelPage/ModelPage_U.json';
import { Button } from 'antd';

import { TransformsSchemaOptions } from '@/transforms';

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

const Template = ({ hasGroup, pattern, code, pageCode, ...args }) => {
  const [open, show, hidden] = useOpen();

  const successCallback = () => {};

  const [loading, setLoading] = useState(false);

  const { metaSchema } = useJsonMetaSchema(pageCode);

  const [formConfig, setFormConfig] = useState<IFormProps>({});

  const [options, setOptions] = useState<TransformsSchemaOptions>(null);

  const fetchDetail = () => {
    requestGet('local-api/model-page/detail', { pageCode: code })
      .then((res) => {
        const { data } = res;

        setFormConfig({
          initialValues: data,
        });

        setOptions({ metaSchema, pattern: 'DETAIL' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClick = () => {
    fetchDetail();
    show();
  };

  return (
    <>
      <Button onClick={handleClick}>点击打开</Button>
      <ModalForm
        options={options}
        open={open}
        formConfig={formConfig}
        getLogicConfig={getLogicConfig}
      />
    </>
  );
};

export const basic = Template.bind({});

basic.args = {
  code: 'ModelPage_Data_C',
  pageCode: 'ModelPage_U',
};
