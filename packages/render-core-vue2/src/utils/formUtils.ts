import {
  Form,
  GeneralField,
  IFieldResetOptions,
  isDataField,
  isField,
  isGeneralField,
  isVoidField,
  LifeCycleTypes,
} from '@formily/core';
import { ISchema } from '@formily/json-schema';
import { toJS } from '@formily/reactive';
import { FormPathPattern } from '@formily/shared';
import BigNumber from 'bignumber.js';
import { nextTick } from 'vue';

import { dashToDotValue, toArray } from '@/utils';

import { scrollToField } from './scrollToField';

export const validateForm = async (form: Form, pattern: FormPathPattern = '*') => {
  form.setValidating(true);
  const tasks: Promise<void>[] = [];

  form.query(pattern).forEach((field) => {
    if (!isVoidField(field)) {
      field.setFeedback({
        type: 'error',
        messages: [],
      });

      if (field.visible) {
        tasks.push(field.validate());
      }
    }
  });
  form.clearErrors();
  await Promise.all(tasks);

  form.setValidating(false);

  const errors = form.queryFeedbacks({ type: 'error' });

  if (errors.length) {
    form.notify(LifeCycleTypes.ON_FORM_VALIDATE_FAILED);

    return Promise.reject(errors);
  }
  form.notify(LifeCycleTypes.ON_FORM_VALIDATE_SUCCESS);
  return Promise.resolve(form.values);
};

export const getSubmitFormValues = (form: Form, pattern: FormPathPattern = '*') => {
  return validateForm(form, pattern)
    .then(() => {
      return dashToDotValue(toJS(form.values));
    })
    .catch((err) => {
      console.error(err);

      const selector = `.form-id-${form.id} .is-error`;

      scrollToField(selector, {
        block: 'center',
      });

      return Promise.reject(err);
    });
};

// 保存的时候获取表单值
export const getFormValues = (form: Form) => {
  return Promise.resolve(dashToDotValue(toJS(form.values)));
};

export const fieldResetValue = (
  form: Form,
  fieldCodes: FormPathPattern[],
  options?: IFieldResetOptions,
) => {
  toArray(fieldCodes).forEach((field) => {
    form.query(field).forEach((target) => {
      if (isField(target)) {
        target
          .reset({
            forceClear: true,
            validate: false,
            ...options,
          })
          .then(() => void 0);
      }
    });
  });
};

export const fieldSetValue = (
  form: Form,
  fieldCode: FormPathPattern,
  value: any,
  triggerInputChange?: boolean,
) => {
  if (triggerInputChange === undefined || triggerInputChange) {
    form.query(fieldCode).forEach((target) => {
      if (isField(target)) {
        target.onInput(value).then(() => void 0);
      }
    });
  } else {
    form.setValuesIn(fieldCode, value);
  }
};

export const fieldVisible = (form: Form, when: boolean, fulfill: string[], otherwise: string[]) => {
  nextTick(() => {
    toArray(fulfill).forEach((key) => {
      form.setFieldState(key, (state) => {
        state.visible = when;
      });
    });
    toArray(otherwise).forEach((key) => {
      form.setFieldState(key, (state) => {
        state.visible = !when;
      });
    });
  });
};

export const fieldDisabled = (
  form: Form,
  disabled: boolean,
  fields: FormPathPattern[],
  otherwise?: FormPathPattern[],
) => {
  nextTick(() => {
    toArray(fields).forEach((key) => {
      form.setFieldState(key, (state) => {
        if (state.pattern !== 'readOnly') {
          state.disabled = disabled;
        }
      });
    });

    if (otherwise) {
      toArray(otherwise).forEach((key) => {
        form.setFieldState(key, (state) => {
          if (state.pattern !== 'readOnly') {
            state.disabled = !disabled;
          }
        });
      });
    }
  });
};

export const fieldRequired = (
  form: Form,
  required: boolean,
  fields: FormPathPattern[],
  otherwise?: FormPathPattern[],
) => {
  nextTick(() => {
    toArray(fields).forEach((key) => {
      form.setFieldState(key, (state) => {
        state.required = required;
      });
      form.clearErrors(key);
    });

    if (otherwise) {
      toArray(otherwise).forEach((key) => {
        form.setFieldState(key, (state) => {
          state.required = !required;
        });
        form.clearErrors(key);
      });
    }
  });
};

export const fieldSum = (
  form: Form,
  fieldCode: FormPathPattern,
  targetMap: Record<string, any>,
  triggerOnInput?: boolean,
) => {
  const data = toArray(form.getValuesIn(fieldCode));

  Object.keys(targetMap).forEach((key) => {
    const sum = data.reduce((acc: BigNumber, cur: any) => {
      return acc.plus(cur[key] || 0);
    }, new BigNumber(0));

    const sumValue = sum.toNumber();

    if (triggerOnInput) {
      form.query(targetMap[key]).forEach((target) => {
        if (isField(target)) {
          target.onInput(sumValue).then(() => void 0);
        }
      });
    } else {
      form.setValuesIn(targetMap[key], sumValue);
    }
  });
};

export const fieldDestroy = (field: GeneralField, forceClear = true) => {
  if (isDataField(field) && forceClear) {
    const form = field.form;
    const path = field.path;
    form.deleteValuesIn(path);
    form.deleteInitialValuesIn(path);
  }
  if (isGeneralField(field)) {
    field.dispose();
  }
};

export const getFieldIndexes = (field: GeneralField, defaultIndex?: string): string => {
  const address = field.address.toString();

  const { form } = field;

  return (Object.keys(form.indexes).find((index) => form.indexes[index] === address) ??
    defaultIndex ??
    field.props.name) as string;
};

export const getSchemaDataFields = (schema: ISchema): string[] => {
  const { properties } = schema;

  if (!properties) {
    return [];
  }

  return Object.values(properties || {}).reduce((acc, prop) => {
    if (prop.type === 'void') {
      return acc.concat(getSchemaDataFields(prop));
    }

    return acc.concat(prop.name);
  }, []);
};

export const isReadOnlyField = (filed: GeneralField) => {
  return filed && filed.pattern === 'readOnly';
};
