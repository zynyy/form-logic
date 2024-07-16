import { RecursionField, useFieldSchema, Schema } from '@formily/react';

import { createElement, FunctionComponentElement } from 'react';

const useSchemaBtn = (): FunctionComponentElement<any>[] | null => {
  const arraySchema = useFieldSchema();

  const parseSources = (schema: Schema): FunctionComponentElement<any>[] => {
    return schema.reduceProperties((btn: FunctionComponentElement<any>[], curSchema) => {
      const { name } = curSchema;

      if (name === 'tableButtons') {
        return btn.concat(parseSources(curSchema));
      }

      if (name) {
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
