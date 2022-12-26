import { usePrefixCls } from '@/components/hooks';
import style from '../style';
import { UseStyleReturnType } from '@/interface';


export const useListTableStyle = (): UseStyleReturnType => {
  const prefixCls = usePrefixCls('formily-list-table');

  const [warpSSR, hashId] = style(prefixCls);

  return [warpSSR, hashId, prefixCls];
};
