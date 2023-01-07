import { FC, HTMLAttributes, PropsWithChildren } from 'react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

type ReactFC<P = {}> = FC<PropsWithChildren<P>>;

export interface SortableContainerProps extends PropsWithChildren {
  list: any[];
  accessibility?: {
    container?: Element;
  };
  onSortStart?: (event: DragStartEvent) => void;
  onSortEnd?: (event: { oldIndex: number; newIndex: number }) => void;
  start?: number;
}

const SortableContainer = <T extends HTMLAttributes<HTMLElement>>(
  Component: ReactFC<T>,
): ReactFC<SortableContainerProps & T> => {
  return ({ list, accessibility, start, onSortStart, onSortEnd, ...props }) => {
    const handleSortEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      const oldIndex = (active.id as number) - 1;
      const newIndex = (over?.id as number) - 1;
      onSortEnd?.({
        oldIndex,
        newIndex,
      });
    };

    const items = list?.map((_, index) => index + (start ?? 0) + 1) || [];

    return (
      <DndContext accessibility={accessibility} onDragStart={onSortStart} onDragEnd={handleSortEnd}>
        <SortableContext items={items}>
          <Component {...(props as unknown as T)}>{props.children}</Component>
        </SortableContext>
      </DndContext>
    );
  };
};

export default SortableContainer;
