import { inject, provide, InjectionKey, Ref, ref } from 'vue';
import { GeneralField } from '@formily/core';

export const FieldSymbol: InjectionKey<Ref<GeneralField>> = Symbol('field');

export const useField = <T = GeneralField>(): Ref<T> => {

  return inject(FieldSymbol, ref()) as any;
};

export const provideField = (field: Ref<GeneralField>) => {
  provide(FieldSymbol, field);
};
