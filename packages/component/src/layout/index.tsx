import { CSSProperties, FC, PropsWithChildren, ReactNode } from 'react';

import { useLayoutStyle } from '@/layout/hooks';
import cls from 'classnames';
import PageLoading from '@/page-loading';

export interface LayoutProps extends PropsWithChildren {
  footer?: ReactNode;
  header?: ReactNode;
  className?: string;
  style?: CSSProperties;
  height?: number | string;
  loading?: boolean;
}

const Layout: FC<LayoutProps> = ({
  header,
  loading,
  footer,
  children,
  className,
  height,
  style,
}) => {
  const [warpSSR, hashId, prefixCls] = useLayoutStyle();

  const renderHeader = () => {
    if (!header) {
      return null;
    }

    return <div className={cls(`${prefixCls}-header`, hashId)}>{header}</div>;
  };

  const renderFooter = () => {
    if (!footer) {
      return null;
    }

    return <div className={cls(`${prefixCls}-footer`, hashId)}>{footer}</div>;
  };

  return warpSSR(
    <PageLoading loading={loading}>
      <div
        className={cls(className, hashId, prefixCls, `${prefixCls}-wrapper`)}
        style={{ ...style, height }}
      >
        {renderHeader()}
        <div className={cls(`${prefixCls}-body`, hashId)}>{children}</div>
        {renderFooter()}
      </div>
    </PageLoading>,
  );
};

export default Layout;
