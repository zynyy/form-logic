import { setValidateLanguage } from '@formily/core';

import { FormProvider } from '@/formily-vue';
import { defineComponent, ref, toRef, watch, watchEffect } from 'vue';
import { Empty, Skeleton } from 'ant-design-vue';

import { useNotifyDevtools } from '@/hooks';
import useCreateSchemaField from '@/hooks/useSchemaField';

import { clone } from '@formily/shared';

import { SchemeFormProps, getSchemeFormProps } from '@/scheme-form/interface';
import { provideSchemeForm } from '@/scheme-form/hooks';

const SchemeForm = defineComponent({
  name: 'SchemeForm',
  inheritAttrs: false,
  props: getSchemeFormProps(),
  setup(props: SchemeFormProps) {
    const {
      getLogicConfig,
      extraLogicParams,
      events,
      pattern,
      loading: propsLoading,
      components,
    } = props;

    const SchemaField = useCreateSchemaField();

    useNotifyDevtools(toRef(props, 'form'));

    watchEffect(() => {
      setValidateLanguage(props.language ?? 'zh-CN');
    });

    let loading = !!propsLoading;

    const schemeFormRef = ref({
      pattern,
      getLogicConfig,
      extraLogicParams,
      events,
    });

    watch(
      () => {
        return {
          pattern: props.pattern,
          getLogicConfig: props.getLogicConfig,
          extraLogicParams: props.extraLogicParams,
          events: props.events,
        };
      },
      (nextSchemeFormRef) => {
        schemeFormRef.value = nextSchemeFormRef;
      },
    );

    provideSchemeForm(schemeFormRef);

    return () => {
      const { schema, form } = props;

      return (
        <Skeleton loading={loading}>
          <FormProvider form={form}>
            <form class={`form-id-${form?.id}`}>
              {schema ? (
                <SchemaField schema={clone(schema)} components={components ?? {}} />
              ) : (
                <Empty description="暂无数据" />
              )}
            </form>
          </FormProvider>
        </Skeleton>
      );
    };
  },
});

export default SchemeForm;
