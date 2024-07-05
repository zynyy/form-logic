import { GlobalRegistry, IDesignerRegistry } from '@formlogic/designer-core';

export const useRegistry = (): IDesignerRegistry => {
  //@ts-ignore
  return window['__DESIGNER_REGISTRY__'] || GlobalRegistry;
};
