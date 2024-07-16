import { clone, fieldDisabled, FormProvider, ISchema } from '@formlogic/render-core-vue3';
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue';

import { useBindBtnClick } from '@/hooks';
import useCreateSchemaField from '@/hooks/useSchemaField';
import { BtnFieldsItem } from '@/interface';
import { provideSchemeForm } from '@/renderer-layout/scheme-form/hooks';
import TransformsButtonsSchema from '@/transforms/TransformsButtonsSchema';

import { getSchemeButtonsFormProps, SchemeButtonsFormProps } from './interface';

const SchemeButtonsForm = defineComponent({
  name: 'SchemeButtonsForm',
  inheritAttrs: false,
  props: getSchemeButtonsFormProps(),
  setup(props: SchemeButtonsFormProps) {
    const { getLogicConfig, extraLogicParams, components } = props;

    const SchemaField = useCreateSchemaField();

    const transformsDone = ref(false);

    const btnList = ref<BtnFieldsItem[]>([]);

    const schema = ref<ISchema>();

    const cb = () => {};

    const setDisabled = () => {
      const { form, disabled } = props;

      if (form) {
        fieldDisabled(form, disabled, ['formButtons.*']);
      }
    };

    watch(
      () => props.disabled,
      () => {
        setDisabled();
      },
    );

    const bindBtnClickOptions = computed(() => {
      const { getLogicConfig, extraLogicParams } = props;
      return {
        form: props.form,
        btnList: btnList.value,
        getLogicConfig,
        logicParams: extraLogicParams ?? {},
        cb,
        autoLogic: transformsDone.value,
      };
    });

    const doneFormId = useBindBtnClick(bindBtnClickOptions);

    const setButtonsSchema = () => {
      const transformsButtonsSchema = new TransformsButtonsSchema({
        buttons: props.buttons || [],
        pageCode: props.pageCode,
        pattern: props.pattern,
      });

      const { buttonsSchema, btnFields } = transformsButtonsSchema.getButtonsSchema();

      schema.value = buttonsSchema;

      btnList.value = btnFields;

      transformsDone.value = true;

      nextTick(() => {
        setDisabled();
      });
    };

    const schemeFormRef = ref({
      getLogicConfig,
      extraLogicParams,
    });

    watch(
      () => {
        return {
          getLogicConfig: props.getLogicConfig,
          extraLogicParams: props.extraLogicParams,
          pattern: props.pattern,
        };
      },
      (nextSchemeFormRef) => {
        schemeFormRef.value = nextSchemeFormRef;
      },
    );

    provideSchemeForm(schemeFormRef);

    watch(
      () => props.buttons?.map((item) => item.code),
      () => {
        transformsDone.value = false;
        setButtonsSchema();
      },
    );

    onMounted(() => {
      transformsDone.value = false;
      setButtonsSchema();
    });

    return () => {
      const { form, buttons } = props;

      const formId = form?.id || 'formId';

      return buttons?.length && formId === doneFormId.value ? (
        <FormProvider key={formId} form={form}>
          <div class={`button-form-id-${formId}`}>
            <SchemaField schema={clone(schema.value)} components={components ?? {}} />
          </div>
        </FormProvider>
      ) : null;
    };
  },
});

export default SchemeButtonsForm;
