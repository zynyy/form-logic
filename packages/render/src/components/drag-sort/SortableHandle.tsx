import { useSortableItem } from '@/components/drag-sort/context';
import { FC, HTMLAttributes } from 'react';

const SortableHandle = <T extends HTMLAttributes<HTMLElement>>(Component: FC<T>): FC<T> => {
  return (props: T) => {
    const { attributes, listeners } = useSortableItem();
    return <Component {...props} {...attributes} {...listeners} />;
  };
};

export default SortableHandle;
