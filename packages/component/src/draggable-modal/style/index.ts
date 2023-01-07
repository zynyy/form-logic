import { genStyleHook } from '@/style/styleHook';

export const getDraggableModalStyle = genStyleHook('draggable-modal', (token) => {
  const {
    componentCls,
    motionDurationMid,
    zIndexPopupBase,
    fontWeightStrong,
    controlHeightLG,
    lineHeightHeading5,
    fontSizeHeading5,
    padding,
    fontSize,
    lineHeight,
    colorTextDescription,
    fontSizeXL,
  } = token;

  const headerPaddingVertical = padding;

  const headerLineHeight = lineHeightHeading5;
  const headerFontSize = fontSizeHeading5;

  const modalCloseBtnSize = controlHeightLG * 0.55;
  const modalConfirmIconSize = fontSize * lineHeight;
  const modalCloseColor = colorTextDescription;
  const modalHeaderCloseSize = headerLineHeight * headerFontSize + headerPaddingVertical * 2;

  return {
    [`${componentCls}-drag`]: {
      position: 'absolute',
      top: (modalHeaderCloseSize - modalCloseBtnSize) / 2,
      insetInlineEnd: (modalHeaderCloseSize - modalCloseBtnSize) / 2,
      zIndex: zIndexPopupBase + 10,
      padding: 0,
      color: modalCloseColor,
      fontWeight: fontWeightStrong,
      lineHeight: 1,
      textDecoration: 'none',
      background: 'transparent',
      width: modalConfirmIconSize,
      height: modalConfirmIconSize,
      border: 0,
      outline: 0,
      cursor: 'move',
      transition: `color ${motionDurationMid}, background-color ${motionDurationMid}`,
      fontSize: fontSizeXL,
    },
  };
});
