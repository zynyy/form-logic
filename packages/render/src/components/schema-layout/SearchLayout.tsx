import SchemaLayout from '@/components/schema-layout/SchemaLayout';
import WhereLayout, { WhereLayoutProps } from '@/components/schema-layout/WhereLayout';
import { FC, PropsWithChildren } from 'react';
import { Spin } from 'antd';

interface SearchLayoutProps extends WhereLayoutProps, PropsWithChildren {
  loading?: boolean;
}

const SearchLayout: FC<SearchLayoutProps> = ({ loading, children, ...restProps }) => {
  return (
    <Spin spinning={loading}>
      <SchemaLayout header={<WhereLayout {...restProps} />}>
        {children}
      </SchemaLayout>
    </Spin>
  );
};

export default SearchLayout;
