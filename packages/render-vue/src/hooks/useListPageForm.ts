import useListSchema from './useListSchema';
import { useCreateForm } from '@/hooks/useCreateForm';
import { useNotifyTransformOptionsChange } from '@/hooks/useNotifyTransformOptionsChange';
import { useBindBtnClick, useBindLogic } from '@/hooks/useLogic';
import { Form, IFormProps } from '@formily/core';
import { TransformsSchemaOptions } from '@/transforms';
import { AnyObject, EventsObject, LogicConfig, MetaSchemaData } from '@/interface';

import { ISchema } from '@formily/json-schema';
import { computed, Ref, ref, watch, watchEffect } from 'vue';

interface ListPageFormArgs {
  searchFormConfig?: IFormProps;
  onSearchMount?: (form: Form) => void;
  onTableMount?: (form: Form) => void;
  autoRefreshForm?: boolean;
  options: Ref<TransformsSchemaOptions>;
  getLogicConfig: LogicConfig;
  logicParams: AnyObject;
  events: EventsObject;
  cb?: (...arg) => void;
}

interface ListPageForm {
  searchForm: Form;
  searchFormLoading: boolean;
  tableFormLoading: boolean;
  dataTableForm: Form;
  searchButtons: MetaSchemaData[];
  searchSchema: ISchema;
  tableSchema: ISchema;
  hasCollapsed: boolean;
  refreshForm: (formConfig?: IFormProps) => string;
}

const useListPageForm = (args: ListPageFormArgs): Ref<ListPageForm> => {
  const {
    options,
    searchFormConfig,
    onSearchMount,
    onTableMount,
    getLogicConfig,
    logicParams,
    events,
    cb,
  } = args;

  const searchFormLoading = ref(true);
  const tableFormLoading = ref(true);

  const createFormOptions = computed(() => {
    return {
      formConfig: searchFormConfig,
      onMount: onSearchMount,
    };
  });

  const [searchForm, _refreshForm] = useCreateForm(createFormOptions);

  const [dataTableForm] = useCreateForm(
    ref({
      onMount: onTableMount,
    }),
  );

  const listSchemaRef = useListSchema(options);

  useNotifyTransformOptionsChange(searchForm, options);

  const nextFormId = ref<string>(searchForm.value.id);

  watch(
    () => searchForm.value.id,
    (nextId) => {
      nextFormId.value = nextId;
    },
  );

  const bindLogicOptions = computed(() => {
    const { transformsDone, searchLogic } = listSchemaRef.value;

    const autoLogic = transformsDone && nextFormId.value === searchForm.value.id;

    return {
      cb,
      logicList: searchLogic,
      getLogicConfig,
      logicParams,
      autoLogic,
    };
  });

  const searchDoneFormIdRef = useBindLogic(searchForm, bindLogicOptions);

  const btnClickOptions = computed(() => {
    const { transformsDone, tableBtnFields } = listSchemaRef.value;

    const autoLogic = transformsDone && nextFormId.value === searchForm.value.id;

    return {
      form: dataTableForm.value,
      btnList: tableBtnFields,
      getLogicConfig,
      logicParams,
      events,
      cb,
      autoLogic,
    };
  });

  const btnFormIdRef = useBindBtnClick(btnClickOptions);

  const tableDoneFormIdRef = useBindLogic(
    dataTableForm,
    computed(() => {
      const { transformsDone, tableLogic } = listSchemaRef.value;
      return {
        getLogicConfig,
        logicList: tableLogic,
        logicParams,
        autoLogic: transformsDone,
        cb,
      };
    }),
  );

  watchEffect(() => {
    searchFormLoading.value = searchForm.value?.id === searchDoneFormIdRef.value;
  });

  watchEffect(() => {
    tableFormLoading.value =
      dataTableForm.value?.id === tableDoneFormIdRef.value &&
      dataTableForm.value?.id === btnFormIdRef.value;
  });

  const refreshForm = (config: IFormProps) => {
    nextFormId.value = _refreshForm(config);
    searchFormLoading.value = true;
    tableFormLoading.value = true;

    return nextFormId.value;
  };

  return computed(() => {
    const { searchButtons, searchSchema, tableSchema, hasCollapsed } = listSchemaRef.value;

    return {
      searchForm: searchForm.value,
      searchFormLoading: !(searchFormLoading.value),
      tableFormLoading: !(tableFormLoading.value),
      dataTableForm: dataTableForm.value,
      searchButtons,
      searchSchema,
      tableSchema,
      hasCollapsed,
      refreshForm,
    };
  });
};

export default useListPageForm;
