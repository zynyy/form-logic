import { Schema, SchemaKey, useFieldSchema } from '@formlogic/render-core-vue2';

export interface TabPropertiesItem {
  name: SchemaKey;
  title: string;
  schema: Schema;
}

const usePropertiesSources = () => {
  const schema = useFieldSchema();
  if (schema.value) {
    return schema.value.reduceProperties((tabs: TabPropertiesItem[], schema) => {
      const { name, title } = schema;
      return tabs.concat({
        name: name ?? '',
        title,
        schema,
      });
    }, []);
  }

  return [];
};

export default usePropertiesSources;
