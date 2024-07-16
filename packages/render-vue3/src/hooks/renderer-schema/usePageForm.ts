import {
  Form,
  IFormProps,
  ISchema,
  SchemaPattern,
  useCreateForm,
} from '@formlogic/render-core-vue3';
import { Ref, computed, shallowRef, watch } from 'vue';

import { useNotifyTransformOptionsChange } from '@/hooks/devtool/useNotifyTransformOptionsChange';
import { useFormSchema } from '@/hooks/renderer-schema/useFormSchema';
import { useBindBtnClick, useBindLogic } from '@/hooks/useLogic';
import { AnyObject, LogicConfig, MetaSchemaData } from '@/interface';
import { TransformsSchemaOptions } from '@/transforms';

interface PageFormArgs {
  formConfig?: IFormProps;
  onFormMount?: (form: Form) => void;
  autoRefreshForm?: boolean;
  options: TransformsSchemaOptions;
  getLogicConfig: LogicConfig;
  logicParams: AnyObject;
  cb?: (...arg: any[]) => void;
}

interface PageForm {
  form: Form;
  formLoading: boolean;
  schema: ISchema;
  buttons: MetaSchemaData[];
  pattern: SchemaPattern;
  refreshForm: (formConfig?: IFormProps) => string;
}

const usePageForm = (pageFormArgsRef: Ref<PageFormArgs>): Ref<PageForm> => {
  const optionsRef = shallowRef(pageFormArgsRef.value.options);

  const createFormOptionsRef = shallowRef({
    formConfig: pageFormArgsRef.value.formConfig,
    onMount: pageFormArgsRef.value.onFormMount,
    autoRefreshForm: pageFormArgsRef.value.autoRefreshForm,
  });

  watch(
    () => pageFormArgsRef.value.options,
    (nextOptions) => {
      optionsRef.value = nextOptions;
    },
  );

  watch(
    () => {
      return {
        formConfig: pageFormArgsRef.value.formConfig,
        onMount: pageFormArgsRef.value.onFormMount,
        autoRefreshForm: pageFormArgsRef.value.autoRefreshForm,
      };
    },
    (nextFormOptions) => {
      createFormOptionsRef.value = nextFormOptions;
    },
  );

  const formSchemaRef = useFormSchema(optionsRef);

  const [form, _refreshForm] = useCreateForm(createFormOptionsRef);

  const nextFormId = shallowRef(form.value.id);

  watch(
    () => form.value.id,
    () => {
      nextFormId.value = form.value.id;
    },
  );

  const bindBtnClickOptions = computed(() => {
    const { btnFields, transformsDone } = formSchemaRef.value;
    const { getLogicConfig, logicParams, cb } = pageFormArgsRef.value;
    const autoLogic = transformsDone && nextFormId.value === form.value.id;
    return {
      form: form.value,
      btnList: btnFields,
      getLogicConfig,
      logicParams,
      cb,
      autoLogic,
    };
  });

  const bindLogicOptions = computed(() => {
    const { logicList, transformsDone } = formSchemaRef.value;
    const { getLogicConfig, logicParams, cb } = pageFormArgsRef.value;
    const autoLogic = transformsDone && nextFormId.value === form.value.id;
    return {
      autoLogic,
      logicList,
      getLogicConfig,
      logicParams,
      cb,
    };
  });

  const btnDoneFormIdRef = useBindBtnClick(bindBtnClickOptions);

  const doneFormIdRef = useBindLogic(form, bindLogicOptions);

  useNotifyTransformOptionsChange(form, optionsRef);

  const refreshForm = (config?: IFormProps) => {
    const formId = _refreshForm(config);
    nextFormId.value = formId;

    return formId;
  };

  const formLoading = computed(() => {
    const isEqFormId =
      nextFormId.value === form.value?.id &&
      form.value?.id === btnDoneFormIdRef.value &&
      form.value?.id === doneFormIdRef.value;

    return !isEqFormId;
  });

  return computed(() => {
    return {
      form: form.value,
      formLoading: formLoading.value,
      schema: formSchemaRef.value.schema,
      buttons: formSchemaRef.value.buttons,
      pattern: formSchemaRef.value.pattern,
      refreshForm,
    };
  });
};

export default usePageForm;
