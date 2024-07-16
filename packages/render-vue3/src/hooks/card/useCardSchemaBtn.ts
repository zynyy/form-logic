import { RecursionField, Schema, useField } from '@formlogic/render-core-vue3';
import { VNode, h } from 'vue';

const useCardSchemaBtn = (schema: Schema, groupCode: string): VNode[] | null => {
  const field = useField();

  const btn = schema.reduceProperties((addition: VNode[], curSchema) => {
    const { name } = curSchema;

    if (
      name &&
      name === 'cardButtons' &&
      ['editable', 'disabled'].includes(curSchema['x-pattern'])
    ) {
      return addition.concat(
        h(RecursionField, {
          attrs: {
            schema: curSchema,
            name,
            key: name,
            basePath: field.value.address.concat(groupCode),
          },
        }),
      );
    }
    return addition;
  }, []);

  return btn.length ? btn : null;
};

export default useCardSchemaBtn;
