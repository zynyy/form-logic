import { RecursionField, useField, useFieldSchema } from '@formlogic/render-core-vue3';
import { VNode, h } from 'vue';

const useGroupSchemaBtn = (): VNode[] | null => {
  const schema = useFieldSchema();
  const field = useField();

  const btn = schema.value
    ? schema.value.reduceProperties((addition: VNode[], schema) => {
        const { name } = schema;

        if (
          name &&
          name === 'groupButtons' &&
          ['editable', 'disabled'].includes(schema['x-pattern'])
        ) {
          return addition.concat(
            h(RecursionField, {
              attrs: {
                schema,
                name,
                key: name,
                basePath: field.value.address,
              },
            }),
          );
        }
        return addition;
      }, [])
    : [];

  return btn.length ? btn : null;
};

export default useGroupSchemaBtn;
