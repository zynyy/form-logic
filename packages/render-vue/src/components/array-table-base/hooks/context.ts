import { inject, InjectionKey, Ref, provide } from 'vue';

export interface SortableContext {
  list: any[];
  startIndex: number;
}

export type SortableContextRef = Ref<SortableContext>;

const SortableContextSymbol: InjectionKey<SortableContextRef> = Symbol('SortableContextSymbol');

export const useSortableContext = (): SortableContextRef => {
  return inject(SortableContextSymbol);
};

export const provideSortableContext = (sortableContext: SortableContextRef) => {
  provide(SortableContextSymbol, sortableContext);
};
