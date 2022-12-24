import React, { CSSProperties, FC, PropsWithChildren } from 'react';

import { usePrefixCls } from '../hooks';
import cn from 'classnames';

import { FormLayoutContext, FormLayoutValueContext, useResponsiveFormLayout } from './hooks';

import useStyle from './style';

export interface FormLayoutProps extends PropsWithChildren, FormLayoutValueContext {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

const FormLayout: FC<FormLayoutProps> = ({
  children,
  prefixCls,
  className,
  style,
  ...otherProps
}) => {
  const { ref, props } = useResponsiveFormLayout(otherProps);
  const formPrefixCls = usePrefixCls('form', { prefixCls });
  const layoutPrefixCls = usePrefixCls('formily-layout', { prefixCls });

  const [wrapSSR, hashId] = useStyle(layoutPrefixCls);

  const layoutClassName = cn(
    layoutPrefixCls,
    {
      [`${formPrefixCls}-${props.layout}`]: true,
      [`${formPrefixCls}-${props.size}`]: props.size,
    },
    className,
    hashId,
  );

  return wrapSSR(
    <div ref={ref} className={layoutClassName} style={style}>
      <FormLayoutContext.Provider value={otherProps}>{children}</FormLayoutContext.Provider>
    </div>,
  );
};

export default FormLayout;
