import { usePageLoadingStyleStyle } from '@/page-loading/hooks';
import { Spin, SpinProps } from 'antd';
import { FC, PropsWithChildren } from 'react';
import cls from 'classnames';

export interface PageLoadingProps extends Omit<SpinProps, 'spinning'>, PropsWithChildren {
  loading?: boolean;
}

const PageLoading: FC<PageLoadingProps> = ({
  children,
  loading,
  wrapperClassName,
  ...restProps
}) => {
  const [warpSSR, hashId, prefixCls] = usePageLoadingStyleStyle();

  return warpSSR(
    <Spin
      {...restProps}
      spinning={loading ?? false}
      wrapperClassName={cls(wrapperClassName, prefixCls, hashId)}
    >
      {children}
    </Spin>,
  );
};

export default PageLoading;
