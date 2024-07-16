import { TransformsSchema } from '@/transforms';
import type { ListSchema, TransformsSchemaOptions } from '@/transforms';
import { useEffect, useState } from 'react';

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

export const useListSchema = (options: TransformsSchemaOptions | undefined): ListSchema => {
  const [listSchema, setListSchema] = useState<ListSchema>(() => {
    return initListSchema;
  });

  useEffect(() => {
    if (options) {
      const transformsSchema = new TransformsSchema(options);
      const schema = transformsSchema.getListSchema();

      setListSchema(schema);
    }

    return () => {
      setListSchema(initListSchema);
    };
  }, [options]);

  return listSchema;
};
