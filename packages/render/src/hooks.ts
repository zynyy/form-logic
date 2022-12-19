import { useEffect, useState } from 'react';

import TransformsSchema, { FormSchema, ListSchema, TransformsSchemaOptions } from '@/transforms';

export const useFormSchema = (options: TransformsSchemaOptions) => {
  const [formSchema, setFormSchema] = useState<FormSchema>({
    schema: {},
    buttons: [],
  });

  useEffect(() => {
    console.log('转换开始', options);

    const transformsSchema = new TransformsSchema(options);
    const schema = transformsSchema.getFormSchema();

    console.log('转换结束', schema);
    setFormSchema(schema);
  }, [options]);

  return formSchema;
};

export const useListSchema = (options: TransformsSchemaOptions): ListSchema => {
  const [listSchema, setListSchema] = useState<ListSchema>({
    searchSchema: null,
    tableSchema: null,
    hasCollapsed: false,
  });

  useEffect(() => {
    console.log('转换开始', options);

    const transformsSchema = new TransformsSchema(options);
    const schema = transformsSchema.getListSchema();

    console.log('转换结束', schema);
    setListSchema(schema);
  }, [options]);

  return listSchema;
};
