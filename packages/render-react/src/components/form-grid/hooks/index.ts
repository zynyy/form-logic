import style from '../style';
import { useComponentStyle } from '@formlogic/component';

export { FormGridContext, useFormGrid } from './context';

export type { FormGridValueContext } from './context';

export const useFormGridStyle = () => {
  return useComponentStyle('form-grid', style);
};
