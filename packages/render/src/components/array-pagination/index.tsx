import { FC, ReactElement, ReactNode, useEffect, useState } from 'react';

import { Pagination, PaginationProps, Space } from 'antd';
import StatusSelect from '@/components/pagination-status-select';
import cls from 'classnames';
import { PaginationContext, useArrayPaginationStyle } from './hooks';
import { observer } from '@formily/react';

interface ArrayPaginationProps extends PaginationProps {
  dataSource?: any[];
  children?: (
    dataSource: any[],
    pagination: ReactNode,
    options: {
      startIndex: number;
      endIndex: number;
    },
  ) => ReactElement;
}

const ArrayTablePagination: FC<ArrayPaginationProps> = observer(
  ({
    pageSize: propsPageSize,
    size: propsSize,
    dataSource: propsDataSource,
    children,
    ...restProps
  }) => {
    const [current, setCurrent] = useState(1);

    const [wrapSSR, hashId, prefixCls] = useArrayPaginationStyle();
    const pageSize = propsPageSize || 10;
    const size = propsSize || 'default';
    const dataSource = propsDataSource || [];
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize - 1;
    const total = dataSource?.length || 0;
    const totalPage = Math.ceil(total / pageSize);

    const pages = Array.from(new Array(totalPage)).map((_, index) => {
      const page = index + 1;
      return {
        label: page,
        value: page,
      };
    });

    const handleChange = (current: number) => {
      setCurrent(current);
    };

    useEffect(() => {
      if (totalPage > 0 && totalPage < current) {
        handleChange(totalPage);
      }
    }, [totalPage, current]);

    const renderPagination = () => {
      if (totalPage <= 1) return;
      return (
        <div className={cls(`${prefixCls}`, hashId)}>
          <Space>
            <StatusSelect
              value={current}
              pageSize={pageSize}
              onChange={handleChange}
              options={pages}
              notFoundContent={false}
            />
            <Pagination
              {...restProps}
              pageSize={pageSize}
              current={current}
              total={dataSource.length}
              size={size}
              showSizeChanger={false}
              onChange={handleChange}
              hideOnSinglePage
            />
          </Space>
        </div>
      );
    };

    return wrapSSR(
      <>
        <PaginationContext.Provider value={{ totalPage, pageSize, changePage: handleChange }}>
          {children?.(dataSource?.slice(startIndex, endIndex + 1), renderPagination(), {
            startIndex,
            endIndex,
          })}
        </PaginationContext.Provider>
      </>,
    );
  }
);

export default ArrayTablePagination;
