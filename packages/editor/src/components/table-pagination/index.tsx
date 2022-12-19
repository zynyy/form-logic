import { Pagination, PaginationProps } from 'antd';
import { FC } from 'react';

interface TablePaginationProps
  extends Required<Pick<PaginationProps, 'current' | 'total' | 'pageSize'>>,
    Pick<PaginationProps, 'pageSizeOptions'> {
  onChange?: (current: number, pageSize: number) => void;
}

const TablePagination: FC<TablePaginationProps> = ({
  current,
  pageSize,
  total,
  onChange,
  pageSizeOptions,
}) => {
  const triggerChange = (currentPage: number, currentPageSize: number) => {
    onChange?.(currentPage, currentPageSize);
  };

  const handleChange = (currentPage: number | undefined, currentPageSize: number | undefined) => {
    triggerChange(currentPage || current, currentPageSize || pageSize);
  };

  const handleShowSizeChange = (
    currentPage: number | undefined,
    currentPageSize: number | undefined,
  ) => {
    triggerChange(1, currentPageSize || pageSize);
  };

  const renderPaginationTotal = (total: number, range: number[]): string =>
    `合计 ${total}; 当前 ${range[0]} 至 ${range[1]}`;

  return (
    <Pagination
      size="small"
      current={current}
      pageSize={pageSize}
      pageSizeOptions={pageSizeOptions}
      total={total}
      onChange={handleChange}
      onShowSizeChange={handleShowSizeChange}
      showTotal={renderPaginationTotal}
      showSizeChanger
      showQuickJumper
    />
  );
};

TablePagination.defaultProps = {
  pageSizeOptions: ['10', '20', '50', '100'],
};

export default TablePagination;
