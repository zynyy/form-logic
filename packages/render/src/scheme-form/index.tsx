import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import {
  Form,
  createForm,
  setValidateLanguage,
  IFormProps,
  JSXComponent,
  onFormMount,
} from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { ISchema } from '@formily/json-schema';

import FormGrid from '../components/form-grid';
import FormItem from '../components/form-item';
import FormLayout from '../components/form-layout';
import FormGroup from '../components/form-group';

import { Empty, Space, Input as AntdInput } from 'antd';
import Input from '@/components/input';
import Select from '@/components/select';
import Fragment from '@/components/fragment';
import ArrayTable from '@/components/array-table';
import Button from '@/components/button';
import ArrayBase from '@/components/array-base';
import FormTabsGroup from '@/components/form-tabs-group';
import ListTable from '@/components/list-table';

const { Password } = AntdInput;

export interface SchemeFormProps {
  formConfig?: IFormProps;
  language?: string;
  schema: ISchema;
  onMount?: (form: Form) => void;
  components?: {
    [key: string]: JSXComponent;
  };
}

export type SchemeFormRef = Form;

const SchemeForm = forwardRef<SchemeFormRef, SchemeFormProps>(
  ({ formConfig, language, schema, components, onMount }, ref) => {
    const form = useMemo<Form>(() => {
      return createForm({
        ...formConfig,
        effects: (form) => {
          formConfig?.effects?.(form);
          onFormMount(() => {
            onMount?.(form);
          });
        },
      });
    }, [formConfig]);

    const SchemaField = useMemo(() => {
      return createSchemaField({
        components: {
          FormLayout,
          FormGroup,
          FormGrid,
          FormItem,
          Input,
          Select: Select,
          ArrayTable,
          Fragment,
          Button,
          ArrayBase,
          Space,
          FormTabsGroup,
          ListTable,
          Password,
        },
      });
    }, []);

    useImperativeHandle(ref, () => {
      return form;
    });

    useEffect(() => {
      setValidateLanguage(language ?? 'zh-CN');
    }, [language]);

    return (
      <FormProvider form={form}>
        <form className={`form-id-${form.id}`}>
          {schema ? (
            <SchemaField schema={schema} components={components} />
          ) : (
            <Empty description="暂无数据" />
          )}
        </form>
      </FormProvider>
    );
  },
);

export default SchemeForm;
