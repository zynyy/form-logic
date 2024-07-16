import { RecursionField, useField, useFieldSchema } from '@formily/react';

import { createElement, FunctionComponentElement } from 'react';

const useGroupSchemaBtn = (groupCode: string): FunctionComponentElement<any>[] | null => {
  const schema = useFieldSchema();
  const field = useField();
  const btn = schema.reduceProperties((addition: FunctionComponentElement<any>[], schema) => {
    const { name } = schema;

    if (name === 'groupButtons' && name && ['editable', 'disabled'].includes(schema['x-pattern'])) {
      return addition.concat(
        createElement<any>(RecursionField, {
          schema,
          name,
          key: name,
          basePath: field.address.concat(groupCode),
        }),
      );
    }
    return addition;
  }, []);

  return btn.length ? btn : null;
};

export default useGroupSchemaBtn;
