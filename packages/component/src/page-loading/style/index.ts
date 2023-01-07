import { genStyleHook } from '@/style/styleHook';

export const pageLoadingStyle = genStyleHook('page-loading', (token) => {
  const { componentCls, antCls } = token || {};

  return {
    [componentCls]: {
      height: '100%',
      [`${antCls}-spin-container`]: {
        height: '100%',
      },
    },
  };
});
