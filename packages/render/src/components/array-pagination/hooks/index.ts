import { usePrefixCls } from '@/components/hooks';
import style from '../style';
import { UseStyleReturnType } from '@/interface';

export { usePagination, PaginationContext } from './context';

export type { PaginationAction } from './context';

export const useArrayPaginationStyle = (): UseStyleReturnType => {
  const prefixCls = usePrefixCls('formily-array-pagination');

  const [warpSSR, hashId] = style(prefixCls);

  return [warpSSR, hashId, prefixCls];
};
