import { createForm, Form, IFormProps, onFormMount } from '@formily/core';
import { markRaw, Ref, ref, shallowRef, watchEffect } from 'vue';

import { isEqual } from '@formily/shared';

interface CreateFormOptions {
  formConfig?: IFormProps;
  onMount?: (form: Form) => void;
  autoRefreshForm?: boolean;
}

export const useCreateForm = (
  options?: Ref<CreateFormOptions>,
): [Ref<Form>, (formConfig?: IFormProps) => string] => {
  const { formConfig } = options.value;

  const prevFormConfig = ref(formConfig);

  const genForm = (config?: IFormProps) => {
    const { onMount } = options.value || {};

    const configMerge = {
      ...formConfig,
      ...config,
    };

    return createForm({
      ...configMerge,
      effects: (form) => {
        configMerge?.effects?.(form);
        onFormMount(() => {
          onMount?.(form);
        });
      },
    });
  };

  const wrapForm = shallowRef<Form>(genForm(formConfig));

  const refreshForm = (config?: IFormProps): string => {
    const nextForm = genForm(config);

    wrapForm.value = nextForm;

    return nextForm.id;
  };

  watchEffect(() => {
    const { formConfig, autoRefreshForm } = options.value;

    if (autoRefreshForm && !isEqual(formConfig, prevFormConfig.value)) {
      prevFormConfig.value = formConfig;
      refreshForm(formConfig);
    }
  });

  return [wrapForm, refreshForm];
};
