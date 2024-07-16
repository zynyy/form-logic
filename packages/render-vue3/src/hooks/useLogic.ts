import { Form, GeneralField, getFieldIndexes, onFieldInit, uid } from '@formlogic/render-core-vue3';
import { merge } from 'lodash-es';
import { ComputedRef, Ref, nextTick, ref, watchEffect } from 'vue';

import effectHook, { BIND_LOGIC_END, BIND_LOGIC_START, EXEC_LOGIC_DONE } from '@/effect-hook';
import { execLogicFn } from '@/exec-logic';
import {
  AnyObject,
  BtnFieldsItem,
  EffectHook,
  LogicArgs,
  LogicConfigFn,
  LogicListItem,
  LogicPayloadArgs,
} from '@/interface';
import { nowTime } from '@/utils';

export const useTriggerLogic = (
  getLogicConfig?: LogicConfigFn,
  cb?: (...arg: any[]) => void,
): [(logicCodes: string[], payload: LogicPayloadArgs) => void] => {
  const execNumRef = ref<Record<string, number>>({});

  const triggerLogic = (logicCodes: string[], payload: LogicPayloadArgs) => {
    logicCodes?.forEach((logicCode) => {
      const { timeFormat: createTime } = nowTime();

      const {
        fieldCode,
        pageCode,
        effectHook,
        form,
        field,
        logicParams,
        extraLogicParams,
        clickParams,
      } = payload || ({} as LogicPayloadArgs);

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

      const callback = (...args: any[]) => {
        cb?.(...args);

        nextTick(() => {
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
        });
      };

      const execInfo: LogicArgs = {
        field,
        form,
        pageCode,
        fieldCode,
        effectHook,
        logicCode,
        execKey,
        callback,
        clearExecNum: () => {
          execNumRef.value[execKey] = 0;
        },
        execNumIsEqual: () => {
          return execNumRef.value[execKey] === currentExecNum;
        },
        extraLogicParams: merge({}, extraLogicParams),
        logicParams: merge({}, logicParams?.[`${effectHook}_${logicCode}`]),
        clickParams: merge({}, clickParams),
      };

      execLogicFn(logicCode, execInfo, getLogicConfig);
    });
  };

  return [triggerLogic];
};

export interface BindLogicOptions {
  logicList: LogicListItem[];
  getLogicConfig?: LogicConfigFn;
  logicParams?: AnyObject;
  cb?: (...arg: any[]) => void;
  autoLogic?: boolean;
}

export const useBindLogic = (form: Ref<Form>, options: Ref<BindLogicOptions>): Ref<string> => {
  const doneFormId = ref('');

  const [triggerLogic] = useTriggerLogic(options.value.getLogicConfig, options.value.cb);

  const effectIdRef = ref(`logic_${uid(8)}`);

  const addEffects = (form: Form, logicList: LogicListItem[], logicParams: Record<string, any>) => {
    const effectId = effectIdRef.value;

    form.addEffects(effectId, () => {
      logicList.forEach((item) => {
        const { fieldCode, logicHooks, pageCode, params } = item;

        form.notify(BIND_LOGIC_START, item);

        Object.keys(logicHooks).forEach((key) => {
          const hook = key as EffectHook;

          const logicCodes = logicHooks[hook];

          if (logicCodes?.length) {
            if (hook !== 'onClick' && effectHook[hook]) {
              if (hook.startsWith('onField')) {
                effectHook[hook]?.(fieldCode, (field: GeneralField) => {
                  triggerLogic(logicCodes, {
                    extraLogicParams: logicParams,
                    logicParams: params,
                    field,
                    form,
                    fieldCode,
                    effectHook: hook,
                    pageCode,
                  });
                });
              } else {
                // @ts-ignore
                effectHook[hook]?.((payload: any) => {
                  triggerLogic(logicCodes, {
                    extraLogicParams: logicParams,
                    logicParams: params,
                    fieldCode,
                    notifyArgs: payload,
                    form,
                    effectHook: hook,
                    pageCode,
                  });
                });
              }
            }
          }
        });

        form.notify(BIND_LOGIC_END, item);
      });

      doneFormId.value = form.id;
    });
  };

  watchEffect((onCleanup) => {
    const effectId = effectIdRef.value;
    onCleanup(() => {
      doneFormId.value = '';
      form.value.removeEffects(effectId);
    });

    if (form.value.id && options.value.autoLogic) {
      addEffects(form.value, options.value.logicList, options.value.logicParams ?? {});
    }
  });

  return doneFormId;
};

export interface BindBtnClickOptions {
  form: Form<any>;
  btnList: BtnFieldsItem[];
  getLogicConfig?: LogicConfigFn;
  logicParams: AnyObject;
  cb?: (...arg: any) => void;
  autoLogic?: boolean;
}

export const useBindBtnClick = (options: ComputedRef<BindBtnClickOptions>): Ref<string> => {
  const { cb, getLogicConfig } = options.value || {};
  const [triggerLogic] = useTriggerLogic(getLogicConfig, cb);

  const doneFormId = ref('');

  const effectId = ref(`btnClickEvent_${uid(8)}`);

  watchEffect((onCleanup) => {
    const { form, btnList, logicParams, autoLogic } = options.value || {};
    if (form?.id && autoLogic) {
      form.addEffects(effectId.value, () => {
        btnList?.forEach((item) => {
          const { fieldCode, clickCodes, pageCode, params } = item || {};
          onFieldInit(fieldCode, (field) => {
            if (clickCodes.length) {
              nextTick(() => {
                field.setComponentProps({
                  onClick: (clickParams: Record<string, any>) => {
                    triggerLogic(clickCodes, {
                      extraLogicParams: logicParams,
                      logicParams: params,
                      field,
                      effectHook: 'onClick',
                      pageCode,
                      form,
                      fieldCode,
                      clickParams,
                    });
                  },
                });
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
