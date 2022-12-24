import { RecursionField, useFieldSchema } from '@formily/react';

import { createElement, FunctionComponentElement } from 'react';

const useGroupSchemaBtn = (): FunctionComponentElement<any>[] | null => {
  const schema = useFieldSchema();
  const btn = schema.reduceProperties((addition: FunctionComponentElement<any>[], schema) => {
    const { name } = schema;

    if (name === 'groupButtons' && name && ['editable', 'disabled'].includes(schema['x-pattern'])) {
      return addition.concat(
        createElement<any>(RecursionField, {
          schema,
          name,
          key: name,
        }),
      );
    }
    return addition;
  }, []);

  return btn.length ? btn : null;
};

export default useGroupSchemaBtn;
