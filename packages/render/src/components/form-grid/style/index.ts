import { genStyleHook } from '@formlogic/component';

export default genStyleHook('form-grid', (token) => {
  const { componentCls } = token;
  return {
    [`${componentCls}-layout`]: {
      display: 'grid',
    },
  };
});

