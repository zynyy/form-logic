import { FC } from 'react';

import { observer, useField } from '@formily/react';

import { ArrayField } from '@formily/core';
import ArrayTableBase, { ArrayTableBaseProps } from '@/components/array-table-base';

interface ArrayTable extends ArrayTableBaseProps {}

export const ArrayTable: FC<ArrayTable> = observer((props) => {
  const field = useField<ArrayField>();

  const handleRemove = (record, index) => {
    field.remove(index);
  };

  const handleAdd = () => {

    field.push({});
  };

  return <ArrayTableBase {...props} onRemove={handleRemove} onAdd={handleAdd} />;
});

export default ArrayTable;
