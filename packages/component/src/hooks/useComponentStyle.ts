import { UseComponentStyleResult, UseStyleReturnType } from '@/style/interface';
import { usePrefixCls } from '@/hooks/useAntd';

export const useComponentStyle = (
  prefix: string,
  componentStyle: (prefixCls: string) => UseComponentStyleResult,
): UseStyleReturnType => {
  const prefixCls = usePrefixCls(`formlogic-component-${prefix}`);
  const [warpSSR, hashId] = componentStyle(prefixCls);

  return [warpSSR, hashId, prefixCls];
};
