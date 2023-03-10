import { genStyleHook } from '@formlogic/component';

export default genStyleHook('array-table-base', (token) => {
  const { componentCls, antCls, formLogicCls } = token;

  return {
    [componentCls]: {
      [`${antCls}-table`]: {
        [`${antCls}-table-title`]: {
          overflow: 'auto',
        },
        td: {
          visibility: 'visible',
        },
      },
      [`${formLogicCls}-form-item`]: {
        marginBottom: 0,
      },
    },
  };
});
