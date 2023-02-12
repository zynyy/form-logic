import { RecursionField, useFieldSchema } from '@/formily-vue';
import { h, VNode } from 'vue';
import { Schema } from '@formily/json-schema';

const useTableSchemaBtn = (): VNode<any>[] | null => {
  const arraySchema = useFieldSchema();

  const parseSources = (schema: Schema): VNode<any>[] => {
    return schema.reduceProperties((btn: VNode<any>[], curSchema) => {
      const { name } = curSchema;

      if (name === 'tableButtons') {
        return btn.concat(parseSources(curSchema));
      }

      if (name) {
        return btn.concat(
          h(RecursionField, {
            schema: curSchema,
            name,
            key: name,
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
