import { SortableItemContext } from './context';
import { FC, HTMLAttributes } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface SortableElementProps {
  index?: number;
  lockAxis?: 'x' | 'y';
}

const SortableElement = <T extends HTMLAttributes<HTMLElement>>(
  Component: FC<T>,
): FC<T & SortableElementProps> => {
  return ({ index = 0, lockAxis, ...props }) => {

    const sortable = useSortable({
      id: index + 1,
    });

    const { setNodeRef, transform } = sortable;

    if (transform) {
      switch (lockAxis) {
        case 'x':
          transform.y = 0;
          break;
        case 'y':
          transform.x = 0;
          break;

        default:
          break;
      }
    }
    const style = {
      ...props.style,
      transform: CSS.Transform.toString(transform),
    };

    return (
      <SortableItemContext.Provider value={sortable}>
        {Component({
          ...props,
          style,
          ref: setNodeRef,
        } as unknown as T)}
      </SortableItemContext.Provider>
    );
  };
};

export default SortableElement;
