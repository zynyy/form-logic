import { genStyleHook } from '@/style/styleHook';

import { genCheckboxStyle } from 'antd/es/checkbox/style';
import { FullToken, mergeToken } from 'antd/es/theme/internal';

interface CheckboxToken extends FullToken<'Checkbox'> {
  checkboxCls: string;
  checkboxSize: number;
}

export const getCheckboxStyle = genStyleHook('checkbox', (token) => {
  const { componentCls } = token;

  const checkboxToken: CheckboxToken = mergeToken<CheckboxToken>(token, {
    checkboxCls: componentCls,
    checkboxSize: token.controlInteractiveSize,
  });

  return [
    genCheckboxStyle(checkboxToken),
    {
      [componentCls]: {
        cursor: 'default',
      },
      [`${componentCls}-wrapper`]: {
        cursor: 'default',
      },
    },
  ];
});
