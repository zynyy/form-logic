import { Form, isVoidField, LifeCycleTypes } from '@formily/core';
import { FormPathPattern } from '@formily/shared';
import { toJS } from '@formily/reactive';

import scrollToField from './scrollToField';

const validateForm = async (form: Form, pattern: FormPathPattern = '*') => {
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

      const selector = `.form-id-${form.id} .ant-formily-item-error`;

      scrollToField(selector);

      return Promise.reject();
    });
};

// 保存的时候获取表单值
export const getFormValues = (form: Form) => {
  return Promise.resolve(toJS(form.values));
};
