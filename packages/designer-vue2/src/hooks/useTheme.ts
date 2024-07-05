import { computed, ComputedRef, inject, ref } from 'vue';

import { DesignerLayoutSymbol } from '@/context';
import { IDesignerLayoutContext } from '@/types';

export const useTheme = (): ComputedRef<Required<IDesignerLayoutContext>['theme']> => {
  return computed(() => {
    return (
      //@ts-ignore
      window['__DESINGER_THEME__'] || inject(DesignerLayoutSymbol, ref()).value?.theme || 'light'
    );
  }) as ComputedRef<Required<IDesignerLayoutContext>['theme']>;
};
