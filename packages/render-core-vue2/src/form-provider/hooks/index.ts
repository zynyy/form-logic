import { Form } from '@formily/core';
import { uid } from '@formily/shared';
import { inject, InjectionKey, onBeforeUnmount, provide, Ref, ref, shallowRef, watch } from 'vue';

export type FormRef = Ref<Form>;

export const FormSymbol: InjectionKey<FormRef> = Symbol('form');

export const useForm = (): FormRef => {
  return inject(FormSymbol, shallowRef<Form>(undefined as unknown as Form));
};

export const provideForm = (form: FormRef) => {
  provide(FormSymbol, form);
};

export const useFormEffects = (effects?: (form: Form) => void): void => {
  const formRef = useForm();
  const effectsId = ref(`formEffects_${uid()}`);

  const stop = watch(
    () => {
      return formRef.value.id;
    },
    () => {
      formRef.value.addEffects(effectsId.value, effects);
    },
    {
      immediate: true,
    },
  );

  onBeforeUnmount(() => stop());
};
