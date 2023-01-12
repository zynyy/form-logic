import SortableElement from './SortableElement';
import { FC, HTMLAttributes } from 'react';

const SortableRowElement = SortableElement((props) => {

  return <tr {...props} />
});

const TableBodyRowSortable: FC<HTMLAttributes<HTMLTableRowElement>> = ({ className, ...props }) => {
  const index = props['data-row-key'] || 0;

  return <SortableRowElement lockAxis="y" {...props} index={index} />;
};

export default TableBodyRowSortable;
