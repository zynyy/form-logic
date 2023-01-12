import { FC, useEffect, memo, useState } from 'react';
import { Form, setValidateLanguage, JSXComponent } from '@formily/core';
import { FormProvider } from '@formily/react';
import { ISchema } from '@formily/react';

import { Empty, Skeleton } from 'antd';

import { useDevEnv } from '@/hooks';
import useCreateSchemaField from '@/hooks/useSchemaField';

import { SchemeFormContent, SchemeFormValueContent } from '@/scheme-form/hooks';

import SettingDrawer from '@/components/setting-drawer';
import { clone } from '@formily/shared';

export interface SchemeFormProps extends SchemeFormValueContent {
  language?: string;
  schema: ISchema;
  loading?: boolean;
  form: Form;
  components?: {
    [key: string]: JSXComponent;
  };
}

const SchemeForm: FC<SchemeFormProps> = ({
  getLogicConfig,
  extraLogicParams,
  events,
  pattern,
  loading,
  language,
  schema,
  components,
  form,
}) => {
  const SchemaField = useCreateSchemaField();

  const isDev = useDevEnv();

  useEffect(() => {
    setValidateLanguage(language ?? 'zh-CN');
  }, [language]);

  return (
    <>
      <Skeleton loading={!!loading}>
        <FormProvider form={form}>
          <SchemeFormContent.Provider
            value={{
              pattern,
              getLogicConfig,
              extraLogicParams,
              events,
            }}
          >
            <form className={`form-id-${form.id}`}>
              {schema ? (
                <SchemaField schema={clone(schema)} components={components ?? {}} />
              ) : (
                <Empty description="暂无数据" />
              )}
            </form>
          </SchemeFormContent.Provider>
        </FormProvider>
      </Skeleton>

      {isDev ? <SettingDrawer form={form} /> : null}
    </>
  );
};

SchemeForm.defaultProps = {
  loading: false,
};

export default memo(SchemeForm);
