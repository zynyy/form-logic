import { withInstall } from '@/utils';

import _FormProvider from './FormProvider';

export const FormProvider = withInstall(_FormProvider);

export { getFormProviderProps } from './interface';

export type { FormProviderProps } from './interface';

export { useForm, provideForm, useFormEffects } from './hooks';

export type { FormRef } from './hooks';
