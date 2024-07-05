import FormProvider from './FormProvider';
export { default as FormProvider } from './FormProvider';
export { provideForm, useForm, useFormEffects } from './hooks';
export type { FormRef } from './hooks';
export { getFormProviderProps } from './interface';
export type { FormProviderProps } from './interface';

declare module 'vue' {
  export interface GlobalComponents {
    FormProvider: typeof FormProvider;
  }
}
