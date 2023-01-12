import { genStyleHook } from '@formlogic/component';

export default genStyleHook('list-table', (token) => {
  const { componentCls, antCls, paddingSM, colorWhite, formLogicCls } = token;

  return {
    [componentCls]: {
      height: '100%',
      [`${antCls}-table`]: {
        td: {
          visibility: 'visible',
        },
      },
      [`${formLogicCls}-form-item`]: {
        marginBottom: 0,
      },
      [`${antCls}-table-wrapper ${antCls}-table-pagination${antCls}-pagination`]: {
        backgroundColor: colorWhite,
        padding: paddingSM,
        margin: 0,
      },
    },
    [`${componentCls} ${antCls}-table-cell`]: {
      whiteSpace: 'nowrap',
    },

  };
});
