import { useArrayItemContext } from '@/components/array-base/hooks/context';

import { usePrefixCls } from '@/components/hooks';
import style from '../style';
import { UseStyleReturnType } from '@/interface';

export const useArrayIndex = () => {
  const ctx = useArrayItemContext();
  return ctx.index ?? 0;
};

export const useArrayItemRecord = () => {
  const ctx = useArrayItemContext();
  return ctx.record || {};
};

export const useArrayBaseStyle = (): UseStyleReturnType => {
  const prefixCls = usePrefixCls('formily-array-base');

  const [warpSSR, hashId] = style(prefixCls);

  return [warpSSR, hashId, prefixCls];
};
