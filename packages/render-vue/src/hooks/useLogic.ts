import { Ref, ref, watch, watchEffect } from 'vue';
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

import effectHook, { BIND_LOGIC_END, BIND_LOGIC_START, EXEC_LOGIC_DONE } from '@/effect-hook';
import { uid } from '@formily/shared';
import { nowTime } from '@/utils';

import { getFieldIndexes } from '@/utils/formUtils';

export const useTriggerLogic = (
  getLogicConfig,
  cb,
): [(logicCodes: string[], payload: LogicPayloadArgs) => void] => {
  const execNumRef = ref({});

  const triggerLogic = (logicCodes: string[], payload: LogicPayloadArgs) => {
    logicCodes?.forEach((logicCode) => {
      const { timeFormat: createTime } = nowTime();

      const { fieldCode, pageCode, effectHook, form, field, ...restPayload } = payload || {};

      let execKey = `${logicCode}_${effectHook}_${fieldCode}`;

      let execFieldCode = fieldCode;

      if (field) {
        execFieldCode = getFieldIndexes(field, fieldCode);

        execKey = `${logicCode}_${effectHook}_${execFieldCode}`;
      }

      if (execNumRef.value[execKey]) {
        execNumRef.value[execKey] = execNumRef.value[execKey] + 1;
      } else {
        execNumRef.value[execKey] = 1;
      }

      const currentExecNum = execNumRef.value[execKey];

      const callback = (...args) => {
        const { time, timeFormat: doneTime } = nowTime();
        form?.notify(EXEC_LOGIC_DONE, [
          {
            logicCode,
            fieldCode,
            execFieldCode,
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
      };

      if (getLogicConfig) {
        getLogicConfig?.(logicCode).then((result) => {
          if (result && result.default) {
            const execLogic = new ExecLogic(
              result.default,
              {
                form,
                field,
                ...restPayload,
              },
              callback,
            );

            const execInfo = {
              pageCode,
              fieldCode,
              effectHook,
              logicCode,
              execKey,
              execNumRef,
              currentExecNum,
              clearExecNum: () => {
                execNumRef.value[execKey] = 0;
              },
            };

            execLogic.run(execInfo).then(() => void 0);
          } else {
            cb?.();
          }
        });
      } else {
        cb?.();
      }
    });
  };

  return [triggerLogic];
};

interface BindLogicOptions {
  logicList: LogicListItem[];
  getLogicConfig: LogicConfig;
  logicParams: AnyObject;
  cb: (...arg) => void;
  autoLogic?: boolean;
}

export const useBindLogic = (form: Ref<Form>, options: Ref<BindLogicOptions>): Ref<string> => {
  const doneFormId = ref('');

  const [triggerLogic] = useTriggerLogic(options.value.getLogicConfig, options.value.cb);

  const effectIdRef = ref(`logic_${uid(8)}`);

  const addEffects = (form, logicList, logicParams) => {
    const effectId = effectIdRef.value;

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

      doneFormId.value = form.id;
    });
  };

  watch(
    () => form.value.id,
    () => {
      console.log(form.value.id, 'form');
    },
  );

  watch(
    () => options.value.autoLogic,
    () => {
      console.log(options.value, 'autoLogic');
    },
  );

  watch(
    () => options.value.logicList,
    () => {
      console.log(options.value.logicList, 'logicList');
    },
  );

  watch(
    () => options.value.logicParams,
    () => {
      console.log(options.value, 'logicParams');
    },
  );

  watchEffect((onCleanup) => {
    const effectId = effectIdRef.value;
    onCleanup(() => {
      doneFormId.value = '';
      form.value.removeEffects(effectId);
    });

    if (form.value.id && options.value.autoLogic) {
      addEffects(form.value, options.value.logicList, options.value.logicParams);
    }
  });

  return doneFormId;
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

export const useBindBtnClick = (options: Ref<BindBtnClickOptions>): Ref<string> => {
  const { cb, getLogicConfig } = options.value || {};
  const [triggerLogic] = useTriggerLogic(getLogicConfig, cb);

  const doneFormId = ref('');

  const effectId = ref(`btnClickEvent_${uid(8)}`);

  watchEffect((onCleanup) => {
    const { form, btnList, events, logicParams, autoLogic } = options.value || {};
    if (form?.id && autoLogic) {
      form.addEffects(effectId.value, () => {
        btnList?.forEach((item) => {
          const { fieldCode, clickCodes, eventCode, pageCode } = item || {};
          onFieldInit(fieldCode, (filed) => {
            if (eventCode && events && events[eventCode]) {
              filed.setComponentProps({
                onClick: events[eventCode],
              });
            }

            if (clickCodes.length) {
              filed.setComponentProps({
                onClick: (...args) => {
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
          });
        });

        doneFormId.value = form.id;
      });
    }

    onCleanup(() => {
      doneFormId.value = '';
      form?.removeEffects(effectId.value);
    });
  });

  return doneFormId;
};
