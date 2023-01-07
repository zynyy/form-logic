import { pageLoadingStyle } from '../style';

import { useComponentStyle } from '@/hooks/useComponentStyle';

export const usePageLoadingStyleStyle = () => {
  return useComponentStyle('page-loading', pageLoadingStyle);
};
