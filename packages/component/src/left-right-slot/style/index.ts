import { genStyleHook } from '@/style/styleHook';

export const leftRightSlotStyle = genStyleHook('left-right-slot', (token) => {
  const { componentCls } = token || {};

  return {
    [componentCls]: {
      '&-left': {
        textAlign: 'start',
      },
      '&-right': {
        textAlign: 'end',
      },
    },
  };
});
