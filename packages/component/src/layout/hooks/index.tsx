import { layoutStyle } from '../style';
import { useComponentStyle } from '@/hooks/useComponentStyle';

export const useLayoutStyle = () => {
  return useComponentStyle('layout', layoutStyle);
};
