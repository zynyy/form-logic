import { genStyleHook } from '@formlogic/component';

export default genStyleHook('array-base', (token) => {
  const { componentCls, colorText, fontSizeLG, colorPrimaryText, colorTextDisabled } = token;
  return {
    [componentCls]: {
      '&-text': {
        whiteSpace: 'nowrap',
      },
      '&-remove, &-copy, &-edit, &-detail': {
        transition: 'all 0.25s ease-in-out',
        color: colorText,
        fontSize: fontSizeLG,

        ':hover': {
          color: colorPrimaryText,
        },

        '&-disabled': {
          color: colorTextDisabled,
          cursor: 'not-allowed ',

          '&:hover': {
            color: colorTextDisabled,
          },
        },
      },

      '&-sort-handle': {
        cursor: 'move',
        color: '#888 ',
      },

      '&-addition': {
        transition: 'all 0.25s ease-in-out',
      },

      '&-move-down, &-move-up': {
        transition: 'all 0.25s ease-in-out',
        color: colorText,
        fontSize: fontSizeLG,
        marginInlineStart: 6,

        ':hover': {
          color: colorPrimaryText,
        },

        '&-disabled': {
          color: colorTextDisabled,
          cursor: 'not-allowed ',

          '&:hover': {
            color: colorTextDisabled,
          },
        },
      },
    },
  };
});
