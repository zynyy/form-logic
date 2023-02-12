import { inject, InjectionKey, Ref, ref, provide, onBeforeUnmount, watchEffect } from 'vue';
import { Form } from '@formily/core';

import { uid } from '@formily/shared';

export type FormRef = Ref<Form>;

export const FormSymbol: InjectionKey<FormRef> = Symbol('form');

export const useForm = (): FormRef => {
  return inject(FormSymbol, ref());
};

export const provideForm = (form: FormRef) => {
  provide(FormSymbol, form);
};

export const useFormEffects = (effects?: (form: Form) => void): void => {
  const formRef = useForm();

  const stop = watchEffect((onCleanup) => {
    const id = uid();
    formRef.value.addEffects(id, effects);

    onCleanup(() => {
      formRef.value.removeEffects(id);
    });
  });

  onBeforeUnmount(() => stop());
};
