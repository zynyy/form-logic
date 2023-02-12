import { ISchema } from '@formily/json-schema';
import { ExtractPropTypes, PropType } from 'vue';

interface SchemaSourceItem {
  name: string;
  schema: ISchema;
}

export const getSchemaFragmentProps = () => {
  return {
    schemaSource: {
      type: Array as PropType<SchemaSourceItem[]>,
    },
  };
};

export type SchemaFragmentProps = ExtractPropTypes<ReturnType<typeof getSchemaFragmentProps>>;
