import { useListSchema } from '@/hooks/useListSchema';
import { useCreateForm } from '@/hooks/useCreateForm';
import { useNotifyTransformOptionsChange } from '@/hooks/useNotifyTransformOptionsChange';
import { useBindBtnClick, useBindLogic } from '@/hooks/useLogic';
import { Form, IFormProps } from '@formily/core';
import { TransformsSchemaOptions } from '@/transforms';
import { AnyObject, EventsObject, LogicConfig, MetaSchemaData } from '@/interface';
import { useEffect, useRef, useState } from 'react';
import { ISchema } from '@formily/react';

interface ListPageFormArgs {
  searchFormConfig?: IFormProps;
  onSearchMount?: (form: Form) => void;
  onTableMount?: (form: Form) => void;
  autoRefreshForm?: boolean;
  options: TransformsSchemaOptions;
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

const useListPageForm = (args: ListPageFormArgs): ListPageForm => {
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

  const [searchFormLoading, setSearchFormLoading] = useState(true);
  const [tableFormLoading, setTableFormLoading] = useState(true);

  const [searchForm, _refreshForm] = useCreateForm({
    formConfig: searchFormConfig,
    onMount: onSearchMount,
  });

  const [dataTableForm] = useCreateForm({
    onMount: onTableMount,
  });

  const {
    searchSchema,
    tableSchema,
    hasCollapsed,
    searchLogic,
    tableLogic,
    tableBtnFields,
    searchButtons,
    transformsDone,
  } = useListSchema(options);

  useNotifyTransformOptionsChange(searchForm, options);

  const nextFormId = useRef<string>(searchForm.id);

  const autoLogic = transformsDone && nextFormId.current === searchForm.id;

  const [searchDoneFormId] = useBindLogic({
    form: searchForm,
    cb,
    logicList: searchLogic,
    getLogicConfig,
    logicParams,
    autoLogic,
  });

  const [btnFormId] = useBindBtnClick({
    form: dataTableForm,
    btnList: tableBtnFields,
    getLogicConfig,
    logicParams,
    events,
    cb,
    autoLogic,
  });

  const [tableDoneFormId] = useBindLogic({
    form: dataTableForm,
    getLogicConfig,
    logicList: tableLogic,
    logicParams,
    autoLogic: transformsDone,
    cb,
  });

  useEffect(() => {
    const isEqFormId = searchForm?.id === searchDoneFormId;
    setSearchFormLoading(!isEqFormId);
  }, [searchDoneFormId, searchForm?.id]);

  useEffect(() => {
    const isEqFormId = dataTableForm?.id === tableDoneFormId && dataTableForm?.id === btnFormId;
    setTableFormLoading(!isEqFormId);
  }, [tableDoneFormId, btnFormId, dataTableForm]);

  const refreshForm = (config: IFormProps) => {
    nextFormId.current = _refreshForm(config);
    setSearchFormLoading(true);

    return nextFormId.current;
  };

  return {
    searchForm,
    searchFormLoading,
    tableFormLoading,
    dataTableForm,
    searchButtons,
    searchSchema,
    tableSchema,
    hasCollapsed,
    refreshForm,
  };
};

export default useListPageForm;
