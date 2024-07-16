import { Engine, isFn } from '@formlogic/designer-core';
import { Ref, onBeforeUnmount } from 'vue';

import { useDesignerEngine } from '@/context';
export interface IEffects {
  (engine: Engine): void;
}

export const useDesigner = (effects?: IEffects): Ref<Engine> => {
  const designer = useDesignerEngine();

  const unRef = isFn(effects) ? effects?.(designer.value) : null;

  onBeforeUnmount(() => {
    //@ts-ignore
    unRef?.();
  });
  return designer;
};
