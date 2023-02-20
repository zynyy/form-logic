
import { defineComponent } from 'vue';
import ArrayTableBase, { getArrayTableBaseProps } from '@/components/array-table-base';
import { ArrayField } from '@formily/core';
import { useField,observer } from '@/formily-vue';
import omit from 'lodash.omit';

const ArrayTable = observer(
  defineComponent({
    name: 'ArrayTable',
    props: {
      ...omit(getArrayTableBaseProps(), ['onRemove', 'onAdd']),
    },
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
