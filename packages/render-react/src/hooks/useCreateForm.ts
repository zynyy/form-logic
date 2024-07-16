import { createForm, Form, IFormProps, onFormMount } from '@formily/core';
import { useEffect, useState } from 'react';

import { isEqual } from '@formily/shared';

interface CreateFormOptions {
  formConfig?: IFormProps;
  onMount?: (form: Form) => void;
  autoRefreshForm?: boolean;
}

export const useCreateForm = (
  options?: CreateFormOptions,
): [Form, (formConfig?: IFormProps) => string] => {
  const { formConfig, autoRefreshForm, onMount } = options || {};

  const [prevFormConfig, setPrevFormConfig] = useState(formConfig);

  const genForm = (config?: IFormProps) => {
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

  const [wrapForm, setWrapForm] = useState(() => {
    return genForm(formConfig);
  });

  const refreshForm = (config?: IFormProps): string => {
    const nextForm = genForm(config);

    setWrapForm(nextForm);
    return nextForm.id;
  };

  useEffect(() => {
    if (autoRefreshForm && !isEqual(formConfig, prevFormConfig)) {
      setPrevFormConfig(formConfig);
      refreshForm(formConfig);
    }
  }, [formConfig, prevFormConfig, autoRefreshForm]);

  return [wrapForm, refreshForm];
};
