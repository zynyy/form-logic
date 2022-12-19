import { FC, PropsWithChildren, ReactNode } from 'react';

import cn from 'classnames';

import './style/index.css'

interface PageHeaderProps extends PropsWithChildren {
  breadcrumb?: ReactNode;
}

const PageHeader: FC<PageHeaderProps> = ({ breadcrumb, children }) => {
  const className = cn('page-header', {
    'page-header-has-breadcrumb': !!breadcrumb,
  });

  return (
    <div className={className}>
      {breadcrumb}
      {children}
    </div>
  );
};

export default PageHeader;
