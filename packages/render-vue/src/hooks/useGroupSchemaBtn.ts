import { h, VNode } from 'vue';
import { RecursionField, useField } from '@/formily-vue';
import { useFieldSchema } from '@/formily-vue/components/schema-field/hooks';

const useGroupSchemaBtn = (groupCode: string): VNode[] | null => {
  const schema = useFieldSchema();
  const field = useField();

  const btn = schema.value.reduceProperties((addition: VNode[], schema) => {
    const { name } = schema;

    if (name && name === 'groupButtons' && ['editable', 'disabled'].includes(schema['x-pattern'])) {
      return addition.concat(
        h(RecursionField, {
          schema,
          name,
          key: name,
          basePath: field.value.address.concat(groupCode),
        }),
      );
    }
    return addition;
  }, []);

  return btn.length ? btn : null;
};

export default useGroupSchemaBtn;
