import { genStyleHook } from '@formlogic/component';

export const whereLayoutStyle = genStyleHook('where-layout', (token) => {
  const { componentCls, marginSM, paddingSM, fontSizeLG, fontSizeXL, colorPrimary, colorWhite } =
    token || {};

  return {
    [componentCls]: {
      ['&-body']: {
        padding: `${paddingSM}px ${paddingSM}px 0`,
      },
      ['&-title-warp']: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1px',
        'padding-left': paddingSM,
        color: colorPrimary,
        backgroundColor: colorWhite,
        borderBottom: '1px solid rgba(5, 5, 5, 0.06)',
      },
      ['&-title']: {
        padding: '10px 5px 8px',
        fontSize: fontSizeLG,
        fontWeight: 'bold',
        borderBottom: `3px solid ${colorPrimary}`,
      },
      ['&-icon']: {
        fontSize: fontSizeXL,
      },
      ['&-right-button']: {
        'text-align': 'right',
      },
    },
  };
});
