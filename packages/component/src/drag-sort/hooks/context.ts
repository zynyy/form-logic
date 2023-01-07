import { createContext, useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';

export interface SortableItemValueContext extends Partial<ReturnType<typeof useSortable>> {}

export const SortableItemContext = createContext<SortableItemValueContext>({});

export const useSortableItemContext = () => {
  return useContext(SortableItemContext);
};
