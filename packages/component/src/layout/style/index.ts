import { genStyleHook } from '@/style/styleHook';

export const layoutStyle = genStyleHook('layout', (token) => {
  const { componentCls, marginSM, fontSize, paddingSM, lineHeight, colorWhite } = token || {};

  return {
    [componentCls]: {
      ['&-wrapper']: {
        display: 'flex',
        flexFlow: 'column nowrap',
        width: '100%',
        height: '100%',
        gap: marginSM,
      },
      ['&-header']: {
        position: 'relative',
        flexShrink: '0',
        padding: '10px 12px',
        border: '1px solid #f0f0f0',
        borderRadius: '8px',
        backgroundColor: colorWhite,
      },
      ['&-body']: {
        flexGrow: '1',
        overflow: 'auto',
        fontSize,
        lineHeight,
        wordWrap: 'break-word',
      },
      ['&-footer']: {
        flexShrink: '0',
        padding: paddingSM,
        backgroundColor: colorWhite,
      },
    },
  };
});

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
