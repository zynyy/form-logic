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
import { FormPathPattern } from '@formily/shared';
import { toJS } from '@formily/reactive';

import scrollToField from './scrollToField';
import { toArray } from '@/utils';

import BigNumber from 'bignumber.js';

export const validateForm = async (form: Form, pattern: FormPathPattern = '*') => {
  form.setValidating(true);
  const tasks = [];

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

export const getSubmitFormValues = (form: Form) => {
  return validateForm(form)
    .then(() => {
      return toJS(form.values);
    })
    .catch((err) => {
      console.error(err);

      const selector = `.form-id-${form.id} .form-item-error`;

      scrollToField(selector);

      return Promise.reject(err);
    });
};

// 保存的时候获取表单值
export const getFormValues = (form: Form) => {
  return Promise.resolve(toJS(form.values));
};

export const fieldResetValue = (
  form: Form,
  fields: FormPathPattern[],
  options?: IFieldResetOptions,
) => {
  toArray(fields).forEach((field) => {
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
  field: FormPathPattern,
  value: any,
  triggerInputChange?: boolean,
) => {
  if (triggerInputChange === undefined || triggerInputChange) {
    form.query(field).forEach((target) => {
      if (isField(target)) {
        target.onInput(value).then(() => void 0);
      }
    });
  } else {
    form.setValuesIn(field, value);
  }
};

export const fieldVisible = (form: Form, when: boolean, fulfill: string[], otherwise: string[]) => {
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
};

export const fieldDisabled = (form: Form, disabled, fields: FormPathPattern[]) => {
  toArray(fields).forEach((key) => {
    form.setFieldState(key, (state) => {
      state.disabled = disabled;
    });
  });
};

export const fieldSum = (
  form: Form,
  field: FormPathPattern,
  targetMap: {},
  triggerOnInput?: boolean,
) => {
  const data = toArray(form.getValuesIn(field));

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
  if (isGeneralField(field)) {
    field.dispose();
  }

  if (isDataField(field) && forceClear) {
    const form = field.form;
    const path = field.path;
    form.deleteValuesIn(path);
    form.deleteInitialValuesIn(path);
  }
};
