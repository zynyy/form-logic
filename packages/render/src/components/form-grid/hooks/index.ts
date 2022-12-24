import { usePrefixCls } from '@/components/hooks';
import style from '../style';
import { UseStyleReturnType } from '@/interface';

export { FormGridContext, useFormGrid } from './context';

export type { FormGridValueContext } from './context';

export const useFormGridStyle = (): UseStyleReturnType => {
  const prefixCls = usePrefixCls('formily-grid');

  const [wrapSSR, hashId] = style(prefixCls);

  return [wrapSSR, hashId, prefixCls];
};
