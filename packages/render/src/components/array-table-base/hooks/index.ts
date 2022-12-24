import { usePrefixCls } from '@/components/hooks';
import style from '../style';
import { UseStyleReturnType } from '@/interface';


export const useArrayTableBaseStyle = (): UseStyleReturnType => {
  const prefixCls = usePrefixCls('formily-array-table-base');

  const [warpSSR, hashId] = style(prefixCls);

  return [warpSSR, hashId, prefixCls];
};
