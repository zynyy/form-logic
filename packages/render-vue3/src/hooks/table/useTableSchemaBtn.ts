import { RecursionField, Schema, useFieldSchema } from '@formlogic/render-core-vue3';
import { VNode, h } from 'vue';

const useTableSchemaBtn = (): VNode[] | null => {
  const arraySchema = useFieldSchema();

  const parseSources = (schema: Schema | undefined): VNode[] => {
    if (!schema) {
      return [];
    }

    return schema.reduceProperties((btn: VNode[], curSchema) => {
      const { name } = curSchema;

      if (name === 'tableButtons') {
        return btn.concat(parseSources(curSchema));
      }

      if (name) {
        return btn.concat(
          h(RecursionField, {
            attrs: {
              schema: curSchema,
              name,
              key: name,
            },
          }),
        );
      }
      return btn;
    }, []);
  };

  const btn = parseSources(arraySchema.value);

  return btn.length ? btn : null;
};

export default useTableSchemaBtn;
