import type { CSSInterpolation, CSSObject } from '@ant-design/cssinjs';
import { useStyleRegister } from '@ant-design/cssinjs';
import merge from 'lodash.merge';

import type { GlobalToken } from 'antd/es/theme/interface';
import { useAntdConfig, useAntdThemeToken } from '@/hooks';

import {
  OverrideComponent,
  StyleInfo,
  TokenWithCommonCls,
  UseComponentStyleResult,
} from '@/style/interface';
import { COMPONENT_PREFIX_CLS } from '@/utils';

export const genCommonStyle = (token: any, componentPrefixCls: string): CSSObject => {
  const { fontFamily, fontSize } = token;

  const rootPrefixSelector = `[class^="${componentPrefixCls}"], [class*=" ${componentPrefixCls}"]`;

  return {
    [rootPrefixSelector]: {
      fontFamily,
      fontSize,
      boxSizing: 'border-box',

      '&::before, &::after': {
        boxSizing: 'border-box',
      },

      [rootPrefixSelector]: {
        boxSizing: 'border-box',

        '&::before, &::after': {
          boxSizing: 'border-box',
        },
      },
    },
  };
};

export const genStyleHook = <ComponentName extends OverrideComponent>(
  component: ComponentName,
  styleFn: (token: TokenWithCommonCls<GlobalToken>, info: StyleInfo) => CSSInterpolation,
) => {
  return (prefixCls: string): UseComponentStyleResult => {
    const { theme, token, hashId } = useAntdThemeToken();
    const { getPrefixCls, iconPrefixCls } = useAntdConfig();
    const rootPrefixCls = getPrefixCls();

    return [
      useStyleRegister(
        {
          theme,
          token,
          hashId,
          path: [COMPONENT_PREFIX_CLS, component, prefixCls, iconPrefixCls],
        },
        () => {
          const componentCls = `.${prefixCls}`;
          const mergedToken: TokenWithCommonCls<GlobalToken> = merge(token, {
            componentCls,
            prefixCls,
            iconCls: `.${iconPrefixCls}`,
            antCls: `.${rootPrefixCls}`,
            formLogicCls: `.${rootPrefixCls}-${COMPONENT_PREFIX_CLS}`
          });

          const styleInterpolation = styleFn(mergedToken, {
            hashId,
            prefixCls,
            rootPrefixCls,
            iconPrefixCls,
          });
          return [genCommonStyle(token, prefixCls), styleInterpolation];
        },
      ),
      hashId,
    ];
  };
};
