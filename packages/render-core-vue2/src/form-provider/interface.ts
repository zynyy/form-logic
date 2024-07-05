import { Form } from '@formily/core';
import { ExtractPropTypes } from 'vue';

import { objectType } from '@/utils';

export const getFormProviderProps = () => {
  return {
    form: objectType<Form>(),
  };
};

export type FormProviderProps = ExtractPropTypes<ReturnType<typeof getFormProviderProps>>;
