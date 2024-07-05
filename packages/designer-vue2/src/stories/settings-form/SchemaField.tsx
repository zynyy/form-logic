import { SchemaComponents, createSchemaField } from '@formlogic/code-render';
import { Divider } from 'element-ui';

const SchemaFields = createSchemaField({
  components: {
    ...SchemaComponents,
    Divider,
  },
});

export const SchemaField = SchemaFields.SchemaField;
