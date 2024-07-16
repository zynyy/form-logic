import { useFieldSchema } from '@formlogic/render-core-vue2';
import { ref, watchEffect } from 'vue';

const useTableCode = () => {
  const tableCode = ref('');

  const schema = useFieldSchema();

  watchEffect(() => {
    if (schema.value) {
      tableCode.value = schema.value.root?.['x-data'].pageCode
        ? `${schema.value.root?.['x-data'].pageCode || ''}_${schema.value.name}`
        : '';
    }
  });

  return tableCode;
};

export default useTableCode;
