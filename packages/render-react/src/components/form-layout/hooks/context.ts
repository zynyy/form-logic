import { createContext, CSSProperties, ReactNode, useContext } from 'react';

export interface FormLayoutValueContext {
  colon?: boolean;
  labelAlign?: 'right' | 'left';
  wrapperAlign?: 'right' | 'left';
  labelCol?: number;
  wrapperCol?: number;
  size?: 'small' | 'default' | 'large';
  tooltipIcon?: ReactNode;
  feedbackLayout?: 'loose' | 'terse' | 'popover' | 'none';
  bordered?: boolean;
  breakpoints?: number[];
  spaceGap?: number;
  gridColumnGap?: number;
  gridRowGap?: number;
  labelStyle?: CSSProperties;
  labelWrap?: boolean;
  labelWidth?: number | string;
  wrapperStyle?: CSSProperties;
  wrapperWrap?: boolean;
  wrapperWidth?: number | string;
}

export const FormLayoutContext = createContext<FormLayoutValueContext>(null);

export const useFormLayoutContext = () => {
  return useContext(FormLayoutContext) || {};
};
