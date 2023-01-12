import type { FormSchema, TransformsSchemaOptions } from '@/transforms';
import { TransformsSchema } from '@/transforms';
import { useEffect, useMemo, useState } from 'react';
import { SchemaPatternEnum } from '@/interface';

const initFormSchema = {
  schema: {},
  buttons: [],
  logicList: [],
  btnFields: [],
  pattern: SchemaPatternEnum.EDITABLE,
  transformsDone: false,
  btnSchema: {},
};

export const useFormSchema = (options: TransformsSchemaOptions): FormSchema => {
  return useMemo(() => {
    if (options) {
      const transformsSchema = new TransformsSchema(options);
      return transformsSchema.getFormSchema();
    }
    return initFormSchema;
  }, [options]);
};
