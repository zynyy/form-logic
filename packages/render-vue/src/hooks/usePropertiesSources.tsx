import { useFieldSchema } from '@/formily-vue';
import { computed } from 'vue';

const usePropertiesSources = () => {
  const schema = useFieldSchema();

  return schema.value.reduceProperties((tabs, schema) => {
    const { name, title } = schema;

    return tabs.concat({
      name,
      title,
      schema,
    });
  }, []);
};

export default usePropertiesSources;
