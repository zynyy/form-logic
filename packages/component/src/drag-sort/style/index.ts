import { genStyleHook } from '@/style/styleHook';

export const  getDragSortStyle = genStyleHook('drag-sort', (token) => {
  const { componentCls } = token;
  return {
    [componentCls]: {
      '&-sort-handle': {
        cursor: 'move',
        color: '#888 ',
      },
    },
  };
});
