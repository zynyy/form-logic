import { SchemaComponents, createSchemaField } from '@formlogic/render-vue2';
import { Divider,FormItem } from 'element-ui';


const SchemaFields = createSchemaField({
  components: {
    ...SchemaComponents,
    Divider,
    FormItem
  },
});

export const SchemaField = SchemaFields.SchemaField;
