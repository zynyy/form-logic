import { staticSearchTreeStyle } from '../style';
import { useComponentStyle } from '@/hooks/useComponentStyle';

export const useStaticSearchTreeStyle = () => {
  return useComponentStyle('static-search-tree', staticSearchTreeStyle);
};
