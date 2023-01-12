import { useComponentStyle } from '@formlogic/component';
import { formLayoutStyle } from '@/components/form-layout/style';

export { default as useResponsiveFormLayout } from './useResponsiveFormLayout';

export { FormLayoutContext, useFormLayoutContext} from './context';

export type {FormLayoutValueContext} from './context'


export const useFormLayoutStyle = () => {

  return useComponentStyle('form-layout', formLayoutStyle)
}
