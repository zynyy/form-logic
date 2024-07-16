import { DataField, Form, toArray, toJS } from '@formlogic/render-core-vue2';

import invokeKeys from '@/utils/invokeKeys';

export const getFormValuesTag = (form: Form, values?: Record<string, any>) => {
  const formValues = values ?? toJS(form.values);

  return Object.keys(formValues)
    .map((key) => {
      const take = form.query(key).take() as DataField;

      const values = toArray(formValues[key]).filter((val) => val === 0 || val);

      if (take && take.visible && values.length) {
        const tagLabel = take.invoke(invokeKeys.getTagLabel, values);

        return {
          value: key,
          label: `${take.title}: ${tagLabel ?? values.join(';')}`,
          disabled: take.disabled,
          required: take.required,
        };
      }
      return undefined;
    })
    .filter((val) => val);
};
