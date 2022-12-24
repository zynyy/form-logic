import { createContext, useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';


export const SortableItemContext = createContext<
  Partial<ReturnType<typeof useSortable>>
  >({})

export const useSortableItem = () => {
  return useContext(SortableItemContext)
}

