import { genStyleHook } from '@formlogic/component';

const style = genStyleHook('form-group', (token) => {
  const { componentCls, antCls } = token || {};

  return {
    [`${componentCls}${antCls}-card`]: {
      [`> ${antCls}-card-body`]: {
        paddingBottom: 0,
      },
    },
  };
});

export default style;
