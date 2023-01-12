import { useEffect, useMemo, useState } from 'react';
import { useFormSchema } from '@/hooks/useFormSchema';
import { useCreateForm } from '@/hooks/useCreateForm';
import { useBindBtnClick, useBindLogic } from '@/hooks/useLogic';
import { useNotifyTransformOptionsChange } from '@/hooks/useNotifyTransformOptionsChange';
import { Form, IFormProps } from '@formily/core';
import { TransformsSchemaOptions } from '@/transforms';
import { AnyObject, EventsObject, LogicConfig, MetaSchemaData, SchemaPattern } from '@/interface';
import { ISchema } from '@formily/react';

interface PageFormArgs {
  formConfig?: IFormProps;
  onFormMount?: (form: Form) => void;
  autoRefreshForm?: boolean;
  options: TransformsSchemaOptions;
  getLogicConfig: LogicConfig;
  logicParams: AnyObject;
  events: EventsObject;
  cb?: (...arg) => void;
}

interface PageForm {
  form: Form;
  formLoading: boolean;
  schema: ISchema;
  buttons: MetaSchemaData[];
  pattern: SchemaPattern;
  refreshForm: (formConfig?: IFormProps) => string;
}

const usePageForm = ({
  formConfig,
  onFormMount,
  autoRefreshForm,
  options,
  getLogicConfig,
  logicParams,
  events,
  cb,
}: PageFormArgs): PageForm => {

  const { schema, buttons, transformsDone, logicList, btnFields, pattern } = useFormSchema(options);

  const [form, _refreshForm] = useCreateForm({
    formConfig,
    onMount: onFormMount,
    autoRefreshForm,
  });

  const [nextFormId, setNextFormId] = useState(form.id);

  useEffect(() => {
    setNextFormId(form.id);
  }, [form?.id]);

  const autoLogic = transformsDone && nextFormId === form.id;

  const [btnDoneFormId] = useBindBtnClick({
    form,
    btnList: btnFields,
    getLogicConfig,
    logicParams,
    events,
    autoLogic,
    cb,
  });

  const [doneFormId] = useBindLogic({
    form,
    logicList,
    getLogicConfig,
    logicParams,
    cb,
    autoLogic,
  });

  useNotifyTransformOptionsChange(form, options);

  const refreshForm = (config: IFormProps) => {
    const formId = _refreshForm(config);
    setNextFormId(formId);

    return formId;
  };

  const formLoading = useMemo(() => {
    const isEqFormId =
      nextFormId && form?.id && form?.id === btnDoneFormId && form?.id === doneFormId;
    return !isEqFormId;
  }, [btnDoneFormId, doneFormId, form?.id, nextFormId]);

  return {
    form,
    formLoading,
    schema,
    buttons,
    pattern,
    refreshForm,
  };
};

export default usePageForm;
