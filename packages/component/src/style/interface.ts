import { ReactElement, ReactNode } from 'react';
import { ComponentTokenMap, GlobalToken } from 'antd/es/theme/interface';
import { CSSInterpolation } from '@ant-design/cssinjs';

export type UseComponent = (node: ReactNode) => ReactElement;

export type UseComponentStyleResult = [UseComponent, string];

export type UseStyleReturnType = [UseComponent, string, string];

export type OverrideComponent = keyof ComponentTokenMap | (string & {});

export interface StyleInfo {
  hashId: string;
  prefixCls: string;
  rootPrefixCls: string;
  iconPrefixCls: string;
}

export type TokenWithCommonCls<T> = T & {
  /** Wrap component class with `.` prefix */
  componentCls: string;
  /** Origin prefix which do not have `.` prefix */
  prefixCls: string;
  /** Wrap icon class with `.` prefix */
  iconCls: string;
  /** Wrap ant prefixCls class with `.` prefix */
  antCls: string;
  formLogicCls: string
};

export type GenerateStyle<
  ComponentToken extends object = TokenWithCommonCls<GlobalToken>,
  ReturnType = CSSInterpolation,
> = (token: ComponentToken, options?: any) => ReturnType;
