import { Form } from '@formily/core';
import { TransformsSchemaOptions } from '@/transforms';

import { TRANSFORMS_OPTIONS_CHANGE } from '@/effect-hook';
import { Ref, watchEffect } from 'vue';

export const useNotifyTransformOptionsChange = (
  form: Ref<Form>,
  options: Ref<TransformsSchemaOptions>,
) => {
  watchEffect(() => {
    if (form.value?.id) {
      form.value.notify(TRANSFORMS_OPTIONS_CHANGE, options.value ?? {});
    }
  });
};
