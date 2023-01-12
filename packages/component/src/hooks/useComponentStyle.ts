import { UseComponentStyleResult, UseStyleReturnType } from '@/style/interface';
import { usePrefixCls } from '@/hooks/useAntd';
import { COMPONENT_PREFIX_CLS } from '@/utils';

export const useComponentStyle = (
  prefix: string,
  componentStyle: (prefixCls: string) => UseComponentStyleResult,
): UseStyleReturnType => {
  const prefixCls = usePrefixCls(`${COMPONENT_PREFIX_CLS}-${prefix}`);
  const [warpSSR, hashId] = componentStyle(prefixCls);

  return [warpSSR, hashId, prefixCls];
};
