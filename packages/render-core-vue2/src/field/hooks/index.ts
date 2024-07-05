import { GeneralField } from '@formily/core';
import { computed, ComputedRef, inject, InjectionKey, provide, Ref, ref } from 'vue';

import { useForm } from '@/form-provider/hooks';

export const FieldSymbol: InjectionKey<<T>() => Ref<T>> = Symbol('field');

export const useField = <T = GeneralField>(): ComputedRef<T> => {
  const filedInject = inject(FieldSymbol, () => {
    return ref() as Ref<T>;
  });

  const form = useForm();

  return computed<T>(() => {
    const field = filedInject().value as GeneralField;

    return (field?.form?.id === form.value?.id ? field : undefined) as T;
  });
};

export const provideField = <T = GeneralField>(field: Ref<T>) => {
  provide(FieldSymbol, () => field);
};
