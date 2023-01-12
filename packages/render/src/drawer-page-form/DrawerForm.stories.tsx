import DrawerForm from './index';
import { useJsonMetaSchema, useOpen } from '@/hooks';
import { useEffect, useState } from 'react';
import { TransformsSchemaOptions } from '@/transforms';
import { IFormProps } from '@formily/core';

import { Button } from 'antd';
import { SchemaTypeSelect } from '@/components/constant-component';
import {
  EffectHookSelect,
  FieldTypeSelect,
  GroupModeSelect,
  RequestMethodSelect,
  YesNoRadio,
} from '@/components/constant-component';
import getLogicConfig from '@/low-code-meta/logic';
import ArrayDrawerTable from '@/components/array-drawer-table';
import FormPageLayout from '@/form-page-layout';

import JsonPopover from '@/components/json-popover';

import { requestGet } from '@/utils/request';

import ModelPage_U from '@/low-code-meta/model-page/ModelPage/ModelPage_U.json';

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

const Template = ({ hasGroup, pattern, code, pageCode, ...args }) => {
  const [open, show, hidden] = useOpen();

  const successCallback = () => {};

  const [loading, setLoading] = useState(false);

  const {metaSchema} = useJsonMetaSchema(pageCode);

  const [formConfig, setFormConfig] = useState<IFormProps>({});

  useEffect(() => {
    if (code) {
      setLoading(true);

      requestGet('local-api/model-page/detail', { pageCode: code })
        .then((res) => {
          const { data } = res;

          setFormConfig({
            initialValues: data,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [code]);

  return (
    <>
      <FormPageLayout
        loading={loading}
        hasGroup
        metaSchema={metaSchema}
        getLogicConfig={getLogicConfig}
        components={{
          ArrayDrawerTable,
          PageCodeSelect: SchemaTypeSelect,
          SchemaTypeSelect,
          FieldTypeSelect,
          GroupModeSelect,
          YesNoRadio,
          RequestMethodSelect,
          EffectHookSelect,
          JsonPopover,
        }}
        formConfig={formConfig}
        extraLogicParams={{
          successCallback,
          action: '',
          extraParams: {},
        }}
      />
    </>
  );
};

export const basic = Template.bind({});

basic.args = {
  code: 'ModelPage_Data_C',
  pageCode: 'ModelPage_U',
};
