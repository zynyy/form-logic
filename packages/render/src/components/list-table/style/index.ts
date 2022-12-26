import { genStyleHook } from '@/style/styleHook';

export default genStyleHook('array-table-base', (token) => {
  const { componentCls, antCls } = token;

  return {
    [componentCls]: {
      [`${antCls}-table`]: {
        td: {
          visibility: 'visible',
        },
      },
      [`${antCls}-formily-form-item`]: {
        marginBottom: 0,
      },
    },
  };
});
