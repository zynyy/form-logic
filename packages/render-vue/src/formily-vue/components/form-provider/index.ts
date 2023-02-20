import FormProvider from './FormProvider';
export { default as FormProvider } from './FormProvider';

export { getFormProviderProps } from './interface';

export type { FormProviderProps } from './interface';

export { useForm, provideForm, useFormEffects } from './hooks';

export type { FormRef } from './hooks';

declare module 'vue' {
  export interface GlobalComponents {
    FormProvider: typeof FormProvider;
  }
}
