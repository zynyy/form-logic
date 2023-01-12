import { genStyleHook } from '@formlogic/component';

export const settingDrawerStyle = genStyleHook('setting-drawer', (token) => {
  const { componentCls, colorPrimary, borderRadiusLG, antCls, iconCls, fontSizeXL, colorWhite } =
    token || {};

  return {
    [`${antCls}-tabs.setting-drawer-tabs ${antCls}-tabs-tabpane`]: {
      height: '100%',
    },
    [`${antCls}-tabs.setting-drawer-tabs ${antCls}-tabs-content`]: {
      height: '100%',
    },

    [`${componentCls}-handle`]: {
      position: 'absolute',
      insetBlockStart: '70px',
      insetInlineEnd: '0px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48px',
      height: '48px',
      fontSize: '16px',
      textAlign: 'center',
      backgroundColor: colorPrimary,
      borderEndStartRadius: borderRadiusLG,
      borderStartStartRadius: borderRadiusLG,
      backdropFilter: 'saturate(180%) blur(20px)',
      cursor: 'pointer',
      pointerEvents: 'auto',
      transition: 'all 0.3s',
      zIndex: 1000,
      [`${iconCls}`]: {
        color: colorWhite,
        fontSize: fontSizeXL,
      },
    },
    [`${componentCls}-exec-logic-history-table .ant-table-cell`]: {
      whiteSpace: 'nowrap',
    },
  };
});
