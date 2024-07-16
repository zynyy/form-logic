import { useCreateSchemaField, VueComponent } from '@formlogic/render-core-vue3';

export const SchemaComponents = {};

const useSchemaField = (components?: Record<string, VueComponent>) => {
  return useCreateSchemaField({
    ...SchemaComponents,
    ...components,
  });
};

export default useSchemaField;
