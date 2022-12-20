import { useEffect, useMemo, useState } from 'react';

import TransformsSchema, { FormSchema, ListSchema, TransformsSchemaOptions } from '@/transforms';
import {
  AnyObject,
  BtnFieldsItem,
  EventsObject,
  LogicConfig,
  LogicListItem,
  MetaSchema,
} from '@/interface';
import { createForm, Form, onFieldInit, onFormMount } from '@formily/core';
import effectHook, { BIND_LOGIC_END, BIND_LOGIC_START } from '@/effect-hook';
import ExecLogic from '@/exec-logic';
import { ISchema } from '@formily/json-schema';
import { getPageConfigDetail } from '@/service';

export const useFormSchema = (options: TransformsSchemaOptions) => {
  const [formSchema, setFormSchema] = useState<FormSchema>({
    schema: {},
    buttons: [],
    logicList: [],
    btnFields: [],
  });

  useEffect(() => {
    console.log('转换开始', options);

    const transformsSchema = new TransformsSchema(options);
    const schema = transformsSchema.getFormSchema();

    console.log('转换结束', schema);
    setFormSchema(schema);
  }, [options]);

  return formSchema;
};

export const useListSchema = (options: TransformsSchemaOptions | undefined): ListSchema => {
  const [listSchema, setListSchema] = useState<ListSchema>({
    searchSchema: null,
    tableSchema: null,
    hasCollapsed: false,
    searchLogic: [],
    tableLogic: [],
    searchBtnFields: [],
    tableBtnFields: [],
  });

  useEffect(() => {
    if (options) {
      console.log('转换开始', options);
      const transformsSchema = new TransformsSchema(options);
      const schema = transformsSchema.getListSchema();

      console.log('转换结束', schema);
      setListSchema(schema);
    }
  }, [options]);

  return listSchema;
};

export const useCreateForm = (formConfig, onMount, form?: Form): [Form] => {
  const wrapForm = useMemo(() => {
    return (
      form ??
      createForm({
        ...formConfig,
        effects: (form) => {
          formConfig?.effects?.(form);
          onFormMount(() => {
            onMount?.(form);
          });
        },
      })
    );
  }, [form?.id]);

  return [wrapForm];
};

export const useBindLogic = (
  form: Form | undefined,
  schema: ISchema,
  logicList: LogicListItem[],
  getLogicConfig: LogicConfig,
  logicParams: AnyObject,
  cb,
) => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (schema && form) {
      form?.addEffects('logic', () => {
        logicList.forEach((item) => {
          const { filed: bindField, logicHooks } = item;

          form.notify(BIND_LOGIC_START, {});

          Object.keys(logicHooks).forEach((hook) => {
            const logicCodes = logicHooks[hook];
            if (hook.startsWith('onField')) {
              effectHook[hook]?.(bindField, (filed) => {
                logicCodes.forEach((logicCode) => {
                  getLogicConfig(logicCode).then((result) => {
                    if (result) {
                      const execLogic = new ExecLogic(
                        result.default,
                        {
                          params: logicParams,
                          filed,
                          form,
                          bindField,
                        },
                        cb,
                      );

                      execLogic.run().then(() => void 0);
                    }
                  });
                });
              });
            } else {
              effectHook[hook]((payload) => {
                logicCodes.forEach((logicCode) => {
                  getLogicConfig(logicCode).then((result) => {
                    if (result) {
                      const execLogic = new ExecLogic(
                        result.default,
                        {
                          params: logicParams,
                          bindField,
                          notifyArgs: payload,
                          form,
                        },
                        cb,
                      );
                      execLogic.run().then(() => void 0);
                    }
                  });
                });
              });
            }
          });

          form.notify(BIND_LOGIC_END, {});
        });

        setDone(true);
      });
    }
    return () => {
      form?.removeEffects('logic');
    };
  }, [form?.id, schema, logicList]);

  return [done];
};

export const useBindBtnClick = (
  form: Form | undefined,
  btnList: BtnFieldsItem[],
  getLogicConfig: LogicConfig,
  logicParams: AnyObject,
  events: EventsObject,
  cb,
) => {
  useEffect(() => {
    if (form?.id) {
      form.addEffects('btnClickEvent', () => {
        btnList?.forEach((item) => {
          const { filed: bindField, clickCodes, eventCode } = item || {};
          onFieldInit(bindField, (filed) => {
            if (clickCodes.length) {
              filed.setComponentProps({
                onLogic: (...args) => {
                  clickCodes.forEach((logicCode) => {
                    getLogicConfig(logicCode).then((result) => {
                      if (result) {
                        const execLogic = new ExecLogic(
                          result.default,
                          {
                            params: logicParams,
                            filed,
                            form,
                            bindField,
                            ...args,
                          },
                          cb,
                        );
                        execLogic.run().then(() => void 0);
                      }
                    });
                  });
                },
              });
            }

            if (eventCode) {
              filed.setComponentProps({
                onClick: events[eventCode],
              });
            }
          });
        });
      });
    }

    return () => {
      form?.removeEffects('btnClickEvent');
    };
  }, [form?.id]);
};

export interface TransformsOptionsArgs extends TransformsSchemaOptions {
  pageCode?: string;
}

export const useTransformsOptions = ({
  pageCode,
  metaSchema,
  schemaMode,
  hasGroup,
}: TransformsOptionsArgs): [TransformsSchemaOptions, boolean] => {
  const [options, setOptions] = useState<TransformsSchemaOptions | undefined>(undefined);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pageCode) {
      setLoading(true);
      getPageConfigDetail({
        pageCode,
      })
        .then((res) => {
          const { data } = res || {};
          setOptions({
            metaSchema: data,
            schemaMode,
            hasGroup,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [pageCode]);

  useEffect(() => {
    if (metaSchema) {
      setOptions({
        metaSchema,
        schemaMode,
        hasGroup,
      });
    }
  }, [metaSchema]);

  return [options, loading];
};
