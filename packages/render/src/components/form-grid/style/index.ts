import { genStyleHook } from '@/style/styleHook';

export default genStyleHook('form-grid', (token) => {
  const { componentCls } = token;
  return {
    [`${componentCls}-layout`]: {
      display: 'grid',
    },
  };
});

