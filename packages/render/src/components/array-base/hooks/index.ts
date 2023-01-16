import { useArrayItemContext } from './context';

import style from '../style';

import { useComponentStyle } from '@formlogic/component';
import { toJS } from '@formily/reactive';

export { useArrayContext } from './context';

export type { ArrayBaseValueContext, ArrayItemValueContext, ArrayContext } from './context';

export const useArrayIndex = () => {
  const ctx = useArrayItemContext();
  return ctx.index ?? 0;
};

export const useArrayItemRecord = () => {
  const ctx = useArrayItemContext();
  return ctx.record ? toJS(ctx.record) : {};
};

export const useArrayBaseStyle = () => {
  return useComponentStyle('array-base', style);
};
