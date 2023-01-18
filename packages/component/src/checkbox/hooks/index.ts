import { getCheckboxStyle } from '../style';
import { useComponentStyle } from '@/hooks/useComponentStyle';

export const useCheckboxStyle = () => {
  return useComponentStyle('checkbox', getCheckboxStyle);
};
