import { createContext, RefObject, useContext } from 'react';

export interface SortableValueContext {
  list: any[];
  start: number;
  containerRef: RefObject<HTMLElement>;
}

export const SortableContext = createContext<SortableValueContext>({
  containerRef: undefined,
  list: [],
  start: 0,
});

export const useSortableContext = () => {
  return useContext(SortableContext);
};
