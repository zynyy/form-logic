import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Form, setValidateLanguage, IFormProps, JSXComponent } from '@formily/core';
import { FormProvider } from '@formily/react';
import { ISchema } from '@formily/json-schema';

import { Empty, Skeleton } from 'antd';

import { useCreateForm } from '@/hooks';
import useCreateSchemaField from '@/hooks/useSchemaField';

export interface SchemeFormProps {
  formConfig?: IFormProps;
  language?: string;
  schema: ISchema;
  onFormMount?: (form: Form) => void;
  done?: boolean;
  form?: Form;
  components?: {
    [key: string]: JSXComponent;
  };
}

export type SchemeFormRef = Form;

const SchemeForm = forwardRef<SchemeFormRef, SchemeFormProps>(
  ({ formConfig, done, language, schema, components, onFormMount, form: propsForm }, ref) => {
    const [warpForm] = useCreateForm(formConfig, onFormMount, propsForm);

    const SchemaField = useCreateSchemaField();

    useImperativeHandle(ref, () => {
      return warpForm;
    });

    useEffect(() => {
      setValidateLanguage(language ?? 'zh-CN');
    }, [language]);

    return (
      <Skeleton loading={!done}>
        <FormProvider form={warpForm}>
          <form className={`form-id-${warpForm.id}`}>
            {schema ? (
              <SchemaField schema={schema} components={components} />
            ) : (
              <Empty description="暂无数据" />
            )}
          </form>
        </FormProvider>
      </Skeleton>
    );
  },
);

SchemeForm.defaultProps = {
  done: true,
};

export default SchemeForm;
