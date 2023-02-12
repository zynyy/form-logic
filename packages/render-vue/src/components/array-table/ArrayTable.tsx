import { observer } from '@/utils/observer';
import { defineComponent } from 'vue';
import { ArrayTableBase } from '@/components/array-table-base';
import { ArrayField } from '@formily/core';
import { useField } from '@/formily-vue';

const ArrayTable = observer(
  defineComponent({
    name: 'ArrayTable',
    props: [],
    setup(props) {
      const field = useField<ArrayField>();

      const handleRemove = (index) => {
        field.value.remove(index).then(() => void 0);
      };

      const handleAdd = () => {
        field.value.push({}).then(() => void 0);
      };

      return () => {
        return <ArrayTableBase {...props} onRemove={handleRemove} onAdd={handleAdd} />;
      };
    },
  }),
);

export default ArrayTable;
