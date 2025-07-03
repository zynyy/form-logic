import { genStyleHook } from '@formlogic/component';

export default genStyleHook('popover-container', (token) => {
  const {  componentCls } = token;
  return {
    [componentCls]: {
      ['&-edit-btn']: {
        width: '100%',
      },
      ['&-detail-btn']: {
        width: '100%',
      },
    },
  };
});
