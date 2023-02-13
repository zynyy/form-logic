import { inject, InjectionKey, Ref, provide } from 'vue';

export interface ListLayoutContext {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  cb: () => void;
}

export type ListLayoutContextRef = Ref<ListLayoutContext>;

const ListLayoutContextSymbol: InjectionKey<ListLayoutContextRef> = Symbol('ListLayoutContextSymbol');

export const useListLayoutContext = (): ListLayoutContextRef => {
  return inject(ListLayoutContextSymbol);
};

export const provideListLayoutContext = (listLayoutContext: ListLayoutContextRef) => {
  provide(ListLayoutContextSymbol, listLayoutContext);
};
