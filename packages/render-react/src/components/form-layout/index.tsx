import { CSSProperties, FC, PropsWithChildren } from 'react';

import cls from 'classnames';

import {
  FormLayoutContext,
  FormLayoutValueContext,
  useFormLayoutStyle,
  useResponsiveFormLayout,
} from './hooks';

export interface FormLayoutProps extends PropsWithChildren, FormLayoutValueContext {
  className?: string;
  style?: CSSProperties;
}

const FormLayout: FC<FormLayoutProps> = ({ children, className, style, ...otherProps }) => {
  const { ref } = useResponsiveFormLayout(otherProps);

  const [wrapSSR, hashId, prefixCls] = useFormLayoutStyle();

  return wrapSSR(
    <div ref={ref} className={cls(prefixCls, className, hashId)} style={style}>
      <FormLayoutContext.Provider value={otherProps}>{children}</FormLayoutContext.Provider>
    </div>,
  );
};

export default FormLayout;
