import { createForm, Form, IFormProps, onFormMount } from '@formily/core';
import { Ref, ref, shallowRef, watchEffect } from 'vue';

import { isEqual } from '@formily/shared';

export interface CreateFormOptions {
  formConfig?: IFormProps;
  onMount?: (form: Form) => void;
  autoRefreshForm?: boolean;
}

export type RefreshForm = (formConfig?: IFormProps) => string;

export const useCreateForm = (optionsRef?: Ref<CreateFormOptions>): [Ref<Form>, RefreshForm] => {
  const { formConfig } = optionsRef?.value || {};

  const prevFormConfig = ref(formConfig);

  const genForm = (config?: IFormProps) => {
    const { onMount } = optionsRef?.value || {};

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
    const { formConfig, autoRefreshForm } = optionsRef?.value || {};

    if (autoRefreshForm && !isEqual(formConfig, prevFormConfig.value)) {
      prevFormConfig.value = formConfig;
      refreshForm(formConfig);
    }
  });

  return [wrapForm, refreshForm];
};
