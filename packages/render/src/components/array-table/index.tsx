import { FC } from 'react';

import { observer, useField } from '@formily/react';

import { ArrayField } from '@formily/core';
import ArrayTableBase, { ArrayTableBaseProps } from '@/components/array-table-base';

export interface ArrayTableProps extends ArrayTableBaseProps {}

const ArrayTable: FC<ArrayTableProps> = observer((props) => {
  const field = useField<ArrayField>();

  const handleRemove = (index) => {
    field.remove(index).then(() => void 0);
  };

  const handleAdd = () => {
    field.push({}).then(() => void 0);
  };

  return <ArrayTableBase {...props} onRemove={handleRemove} onAdd={handleAdd} />;
});

export default ArrayTable;
