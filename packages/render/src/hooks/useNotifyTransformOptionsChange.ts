import { Form } from '@formily/core';
import { TransformsSchemaOptions } from '@/transforms';
import { useEffect } from 'react';
import { TRANSFORMS_OPTIONS_CHANGE } from '@/effect-hook';

export const useNotifyTransformOptionsChange = (form: Form, options: TransformsSchemaOptions) => {
  useEffect(() => {
    if (form?.id) {
      form.notify(TRANSFORMS_OPTIONS_CHANGE, options ?? {});
    }
  }, [form?.id, options]);
};
