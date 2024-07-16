import { SchemaPatternEnum } from '@formlogic/render-core-vue3';
import { computed, Ref } from 'vue';

import type { FormSchema, TransformsSchemaOptions } from '@/transforms';
import { TransformsSchema } from '@/transforms';

const initFormSchema = {
  schema: {},
  buttons: [],
  logicList: [],
  btnFields: [],
  pattern: SchemaPatternEnum.EDITABLE,
  transformsDone: false,
  btnSchema: {},
};

export const useFormSchema = (optionsRef: Ref<TransformsSchemaOptions>): Ref<FormSchema> => {
  return computed(() => {
    if (optionsRef.value) {
      const transformsSchema = new TransformsSchema(optionsRef.value);
      return transformsSchema.getFormSchema();
    }
    return initFormSchema;
  });
};
