import ExecLogic from '@/exec-logic';
import { Form, onFieldInit } from '@formily/core';

import {
  AnyObject,
  BtnFieldsItem,
  EffectHook,
  EventsObject,
  LogicConfig,
  LogicListItem,
  LogicPayloadArgs,
} from '@/interface';
import { useEffect, useMemo, useRef, useState } from 'react';
import effectHook, { BIND_LOGIC_END, BIND_LOGIC_START, EXEC_LOGIC_DONE } from '@/effect-hook';
import { uid } from '@formily/shared';
import { nowTime } from '@/utils';
import { useDeepEffect } from '@formlogic/component';

export const useTriggerLogic = (
  getLogicConfig,
  cb,
): [(logicCodes: string[], payload: LogicPayloadArgs) => void] => {
  const execNumRef = useRef({});

  const triggerLogic = (logicCodes: string[], payload: LogicPayloadArgs) => {
    logicCodes?.forEach((logicCode) => {
      const { timeFormat: createTime } = nowTime();

      const { fieldCode, pageCode, effectHook, form, field, ...restPayload } = payload || {};

      let execKey = `${logicCode}_${effectHook}_${fieldCode}_${form.id}`;

      if (field) {
        const address = field.address.toString();

        const fieldCodeIndex = Object.keys(form.indexes).find(
          (index) => form.indexes[index] === address,
        );
        execKey = `${logicCode}_${effectHook}_${fieldCodeIndex}_${form.id}`;
      }

      if (execNumRef.current[execKey]) {
        execNumRef.current[execKey] = execNumRef.current[execKey] + 1;
      } else {
        execNumRef.current[execKey] = 1;
      }

      const currentExecNum = execNumRef.current[execKey];

      getLogicConfig?.(logicCode).then((result) => {
        if (result && result.default) {
          const execLogic = new ExecLogic(
            result.default,
            {
              form,
              field,
              ...restPayload,
            },
            (...args) => {
              const { time, timeFormat: doneTime } = nowTime();
              form?.notify(EXEC_LOGIC_DONE, [
                {
                  logicCode,
                  fieldCode,
                  pageCode,
                  effectHook,
                  formId: form?.id,
                  time,
                  doneTime,
                  createTime,
                  uid: uid(8),
                },
              ]);

              cb?.(...args);
            },
          );
          execLogic
            .run({
              pageCode,
              fieldCode,
              effectHook,
              logicCode,
              execKey,
              execNumRef,
              currentExecNum,
              clearExecNum: () => {
                execNumRef.current[execKey] = 0;
              },
            })
            .then(() => void 0);
        }
      });
    });
  };

  return [triggerLogic];
};

interface BindLogicOptions {
  form: Form | undefined;
  logicList: LogicListItem[];
  getLogicConfig: LogicConfig;
  logicParams: AnyObject;
  cb: (...arg) => void;
  autoLogic?: boolean;
}

export const useBindLogic = (options: BindLogicOptions): [string] => {
  const { form, getLogicConfig, logicParams, logicList, autoLogic, cb } = options || {};

  const [doneFormId, setDoneFormId] = useState('');

  const [triggerLogic] = useTriggerLogic(getLogicConfig, cb);

  const effectId = useMemo(() => {
    return `logic_${uid(8)}`;
  }, []);

  useDeepEffect(() => {
    if (form?.id && autoLogic) {
      form.addEffects(effectId, () => {
        logicList.forEach((item) => {
          const { fieldCode, logicHooks, pageCode } = item;

          form.notify(BIND_LOGIC_START, {});

          Object.keys(logicHooks).forEach((hook: EffectHook) => {
            const logicCodes = logicHooks[hook];
            if (hook.startsWith('onField')) {
              effectHook[hook]?.(fieldCode, (field) => {
                triggerLogic(logicCodes, {
                  params: logicParams,
                  field,
                  form,
                  fieldCode,
                  effectHook: hook,
                  pageCode,
                });
              });
            } else {
              effectHook[hook]?.((payload) => {
                triggerLogic(logicCodes, {
                  params: logicParams,
                  fieldCode,
                  notifyArgs: payload,
                  form,
                  effectHook: hook,
                  pageCode,
                });
              });
            }
          });

          form.notify(BIND_LOGIC_END, {});
        });

        setDoneFormId(form.id);
      });
    }
    return () => {
      setDoneFormId('');
      form?.removeEffects(effectId);
    };
  }, [form?.id, autoLogic, effectId, logicList]);

  return [doneFormId];
};

interface BindBtnClickOptions {
  form: Form | undefined;
  btnList: BtnFieldsItem[];
  getLogicConfig: LogicConfig;
  logicParams: AnyObject;
  events: EventsObject;
  cb?: (...arg) => void;
  autoLogic?: boolean;
}

export const useBindBtnClick = (options: BindBtnClickOptions): [string] => {
  const { form, btnList, cb, events, getLogicConfig, logicParams, autoLogic } = options || {};

  const [triggerLogic] = useTriggerLogic(getLogicConfig, cb);

  const [doneFormId, setDoneFormId] = useState('');

  const effectId = useMemo(() => {
    return `btnClickEvent_${uid(8)}`;
  }, []);

  useDeepEffect(() => {
    if (form?.id && autoLogic) {
      form.addEffects(effectId, () => {
        btnList?.forEach((item) => {
          const { fieldCode, clickCodes, eventCode, pageCode } = item || {};
          onFieldInit(fieldCode, (filed) => {
            if (clickCodes.length) {
              filed.setComponentProps({
                onLogicClick: (...args) => {
                  triggerLogic(clickCodes, {
                    params: logicParams,
                    filed,
                    effectHook: 'onClick',
                    pageCode,
                    form,
                    fieldCode,
                    ...args,
                  });
                },
              });
            }

            if (eventCode && events && events[eventCode]) {
              filed.setComponentProps({
                onClick: events[eventCode],
              });
            }
          });
        });

        setDoneFormId(form.id);
      });
    }

    return () => {
      form?.removeEffects(effectId);
      setDoneFormId('');
    };
  }, [form?.id, effectId, btnList, autoLogic]);

  return [doneFormId];
};
