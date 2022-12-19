import { useFieldSchema } from '@formily/react';

const usePropertiesSources = () => {
  const schema = useFieldSchema();

  return schema.reduceProperties((tabs, schema) => {
    const { name, title } = schema;

    return tabs.concat({
      name,
      title,
      schema,
    });
  }, []);
};

export default usePropertiesSources;
