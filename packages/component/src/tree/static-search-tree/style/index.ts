import { genStyleHook } from '@/style/styleHook';

export const staticSearchTreeStyle = genStyleHook('static-search-tree', (token) => {
  const { componentCls, colorHighlight,antCls } = token || {};

  return {
    [componentCls]: {
      [`${componentCls}-search-value`]: {
        color: colorHighlight,
      },

      [`${antCls}-tree-list`]: {
        overflowX: 'auto'
      },

      [`${antCls}-tree ${antCls}-tree-treenode`]: {
        whiteSpace:"nowrap"
      }
    },
  };
});
