import { genStyleHook } from '@formlogic/component';

export default genStyleHook('array-pagination', (token) => {
  const { componentCls, antCls, colorErrorBorder } = token;
  return {
    [componentCls]: {
      display: 'flex',
      justifyContent: 'center',
      [`${componentCls}-status-select.has-error`]: {
        [`${antCls}-select-selector`]: {
          borderColor: `${colorErrorBorder} !important`,
        },
      },
    },
  };
});
