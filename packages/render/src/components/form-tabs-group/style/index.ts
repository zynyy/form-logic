import { genStyleHook } from '@/style/styleHook';

export default genStyleHook('form-tabs-group', (token) => {
  const { componentCls, antCls } = token;

  return {
    [`${componentCls}`]: {
      [`${antCls}-card`]: {
        borderTop: 0,
        'border-top-left-radius': 0,
        'border-top-right-radius': 0,
      },
      [` ${antCls}-tabs-top`]: {
        [`> ${antCls}-tabs-nav`]: {
          marginBottom: 0,
        },
      },
    },
  };
});
