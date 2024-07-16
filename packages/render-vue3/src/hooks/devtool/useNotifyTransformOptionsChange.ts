import { Form } from '@formlogic/render-core-vue3';
import { Ref, watchEffect } from 'vue';

import { TRANSFORMS_OPTIONS_CHANGE } from '@/effect-hook';
import { TransformsSchemaOptions } from '@/transforms';

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
