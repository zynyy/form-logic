import {
  clone,
  FormProvider,
  isEmpty,
  observer,
  setValidateLanguage,
} from '@formlogic/render-core-vue3';
import { ElEmpty,  ElForm, ElSkeleton } from 'element-plus';
import { get } from 'lodash-es';
import { defineComponent, onMounted, ref, toRef, watch } from 'vue';

import { useNotifyDevtools } from '@/hooks';
import useCreateSchemaField from '@/hooks/useSchemaField';
import { provideSchemeForm } from '@/renderer-layout/scheme-form/hooks';
import { getSchemeFormProps, SchemeFormProps } from '@/renderer-layout/scheme-form/interface';



const SchemeForm = observer(
  defineComponent({
    name: 'SchemeForm',
    inheritAttrs: false,
    props: getSchemeFormProps(),
    setup(props: SchemeFormProps) {
      const { getLogicConfig, extraLogicParams, pattern, components } = props;

      const SchemaField = useCreateSchemaField();

      useNotifyDevtools(toRef(props, 'form'));

      const setLanguage = () => {
        setValidateLanguage(props.language ?? 'zh-CN');
      };

      watch(
        () => props.language,
        () => {
          setLanguage();
        },
      );

      onMounted(() => {
        setLanguage();
      });

      const schemeFormRef = ref({
        pattern,
        getLogicConfig,
        extraLogicParams,
      });

      watch(
        () => {
          return {
            pattern: props.pattern,
            getLogicConfig: props.getLogicConfig,
            extraLogicParams: props.extraLogicParams,
          };
        },
        (nextSchemeFormRef) => {
          schemeFormRef.value = nextSchemeFormRef;
        },
      );

      provideSchemeForm(schemeFormRef);

      return () => {
        const { schema, form, loading } = props;

        const hasEmpty = isEmpty(get(schema, 'properties.formLayout.properties'));

        const formId = form?.id || 'formId';

        return (
          <ElSkeleton
            loading={loading}
            animated
            throttle={500}
            style={{
              height: '100%',
            }}
          >
            <FormProvider key={formId} form={form}>
              <ElForm
                class={`form-id-${formId}`}
                style={{
                  height: '100%',
                }}
              >
                {!hasEmpty ? (
                  <SchemaField schema={clone(schema)} components={components ?? {}} />
                ) : (
                  <ElEmpty description="暂无数据" />
                )}
              </ElForm>
            </FormProvider>
          </ElSkeleton>
        );
      };
    },
  }),
);

export default SchemeForm;
