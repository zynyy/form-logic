import { Schema } from '@formlogic/render-core-vue2';
import { computed, Ref } from 'vue';

import type { ListSchema, TransformsSchemaOptions } from '@/transforms';
import { TransformsSchema } from '@/transforms';

const initListSchema: ListSchema = {
  searchSchema: new Schema({}),
  tableSchema: new Schema({}),
  hasCollapsed: false,
  searchLogic: [],
  tableLogic: [],
  searchBtnFields: [],
  tableBtnFields: [],
  searchButtons: [],
  transformsDone: false,
};

const useListSchema = (options: Ref<TransformsSchemaOptions>): Ref<ListSchema> => {
  return computed(() => {
    if (options.value) {
      const transformsSchema = new TransformsSchema(options.value);

      return transformsSchema.getListSchema();
    }

    return initListSchema;
  });
};

export default useListSchema;
