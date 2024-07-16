import { FC, memo, useEffect } from 'react';
import { Form, setValidateLanguage } from '@formily/core';
import { FormProvider } from '@formily/react';
import { ISchema } from '@formily/react';

import { Empty, Skeleton } from 'antd';

import { useNotifyDevtools } from '@/hooks';
import useCreateSchemaField from '@/hooks/useSchemaField';

import { SchemeFormContent, SchemeFormValueContent } from '@/scheme-form/hooks';

import { clone } from '@formily/shared';
import { Components } from '@/interface';

export interface SchemeFormProps extends SchemeFormValueContent {
  language?: string;
  schema: ISchema;
  loading?: boolean;
  form: Form;
  components?: Components;
}

const SchemeForm: FC<SchemeFormProps> = ({
  getLogicConfig,
  extraLogicParams,
  events,
  pattern,
  loading: propsLoading,
  language,
  schema,
  components,
  form,
}) => {
  const SchemaField = useCreateSchemaField();

  useNotifyDevtools(form);

  useEffect(() => {
    setValidateLanguage(language ?? 'zh-CN');
  }, [language]);

  const loading = !!propsLoading;

  return (
    <>
      <Skeleton loading={loading}>
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
    </>
  );
};

SchemeForm.defaultProps = {
  loading: false,
};

export default memo(SchemeForm);
