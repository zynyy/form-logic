import Fragment from '@/fragment';
import { VueComponent } from '@/interface';
import { createSchemaField } from '@/schema-field';

export const useCreateSchemaField = (components?: Record<string, VueComponent>) => {
  const { SchemaField } = createSchemaField({
    components: {
      Fragment,
      ...components,
    },
  });

  return SchemaField;
};
