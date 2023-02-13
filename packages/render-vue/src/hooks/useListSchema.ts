import type { ListSchema, TransformsSchemaOptions } from '@/transforms';
import { TransformsSchema } from '@/transforms';
import { computed, Ref } from 'vue';

const initListSchema: ListSchema = {
  searchSchema: null,
  tableSchema: null,
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
