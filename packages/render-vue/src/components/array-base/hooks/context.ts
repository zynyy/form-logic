import { isArrayField } from '@formily/core';
import { useForm } from '@/formily-vue';
import { inject, provide, InjectionKey, Ref, watch, ref, shallowRef } from 'vue';

import { ArrayBaseProps } from '@/components/array-base/interface';

export interface ArrayBaseValueContext {
  fieldAddress: string;
  props: ArrayBaseProps;
}

export interface ArrayItemValueContext {
  index: number;
  record: any;
}

export type ArrayItemContextRef = Ref<ArrayItemValueContext>;

const ArrayBaseContextSymbol: InjectionKey<ArrayBaseValueContext> =
  Symbol('ArrayBaseContextSymbol');

export const ArrayItemContextSymbol: InjectionKey<ArrayItemContextRef> =
  Symbol('ArrayItemContextSymbol');

export const useArrayContext = () => {
  const arrayBaseContext = inject(ArrayBaseContextSymbol);
  const form = useForm();

  const { fieldAddress } = arrayBaseContext || {};

  const target = form.value.query(fieldAddress).take();

  return {
    ...arrayBaseContext,
    field: isArrayField(target) ? target : null,
  };
};

export const provideArrayContext = (arrayContext: ArrayBaseValueContext) => {
  provide(ArrayBaseContextSymbol, arrayContext);
};

export const useArrayItemContext = (): ArrayItemContextRef => {
  return inject(ArrayItemContextSymbol);
};

export const provideArrayItemContext = (arrayItemContext: ArrayItemContextRef) => {
  provide(ArrayItemContextSymbol, arrayItemContext);
};

export const useArrayIndex = (): Ref<number> => {
  const arrayItemContextRef = useArrayItemContext();

  const indexRef = shallowRef(arrayItemContextRef.value.index);

  watch(
    () => arrayItemContextRef.value.index,
    (nextIndex) => {
      indexRef.value = nextIndex;
    },
  );

  return indexRef;
};

export const useArrayItemRecord = <T = any>(): Ref<T> => {
  const arrayItemContextRef = useArrayItemContext();

  const recordRef = ref(arrayItemContextRef.value.record);

  watch(
    () => arrayItemContextRef.value.record,
    (nextRecord) => {
      recordRef.value = nextRecord;
    },
  );

  return recordRef;
};
