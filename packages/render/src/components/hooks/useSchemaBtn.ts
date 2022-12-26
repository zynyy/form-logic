import { RecursionField, useFieldSchema } from '@formily/react';

import { createElement, FunctionComponentElement, ReactNode } from 'react';
import { Schema } from '@formily/json-schema';

const useSchemaBtn = (): FunctionComponentElement<any>[] | null => {
  const arraySchema = useFieldSchema();

  const parseSources = (schema: Schema): FunctionComponentElement<any>[] => {
    return schema.reduceProperties((btn: FunctionComponentElement<any>[], curSchema) => {
      const { name } = curSchema;

      if (name === 'tableButtons') {
        return btn.concat(parseSources(curSchema));
      }

      if (name && ['editable', 'disabled'].includes(curSchema['x-pattern'])) {
        return btn.concat(
          createElement<any>(RecursionField, {
            schema: curSchema,
            name,
            key: name,
          }),
        );
      }
      return btn;
    }, []);
  };

  const btn = parseSources(arraySchema);

  return btn.length ? btn : null;
};

export default useSchemaBtn;
