import { STYLE_PREFIX } from '@/utils/constant';

export const useStylePrefixCls = (prefixCls: string) => {
  return `${STYLE_PREFIX}-${prefixCls}`;
};
