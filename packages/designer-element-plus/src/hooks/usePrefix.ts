import { computed, unref } from 'vue';

import { DesignerLayoutSymbol, useContext } from '@/context';

export const usePrefix = (after = '') => {
  const DesignerLayoutContext = useContext(DesignerLayoutSymbol);
  return computed(() => unref(DesignerLayoutContext)?.prefixCls + after);
};
