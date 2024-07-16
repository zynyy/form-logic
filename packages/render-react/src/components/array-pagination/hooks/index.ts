import style from '../style';

import { useComponentStyle } from '@formlogic/component';

export { usePagination, PaginationContext } from './context';

export type { PaginationAction } from './context';

export const useArrayPaginationStyle = () => {
  return useComponentStyle('array-pagination', style);
};
