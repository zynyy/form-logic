import { createContext, RefObject, useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';

export interface SortableItemValueContext extends Partial<ReturnType<typeof useSortable>> {}

export const SortableItemContext = createContext<SortableItemValueContext>({});

export const useSortableItemContext = () => {
  return useContext(SortableItemContext);
};


export interface SortableBodyValueContext {
  list: any[];
  start: number;
  containerRef: RefObject<HTMLElement>;
  onSortEnd?: (event) => void
}

export const SortableBodyContext = createContext<SortableBodyValueContext>({
  containerRef: undefined,
  list: [],
  start: 0,
});

export const useSortableBodyContext = () => {
  return useContext(SortableBodyContext);
};
