import cx from 'classnames';
import React, { FC } from 'react';
import HtmlTable, { HtmlTableProps } from '@/components/ali-react-table/component/html-table';

export interface TableFooterProps extends Omit<HtmlTableProps, 'verticalRenderInfo' | "htmlTag"> {
  stickyBottom: undefined | number;
}

const tableFooter: FC<TableFooterProps> = ({ stickyBottom, dataSource, ...restProps }) => {
  const last = dataSource ? dataSource.length - 1 : -1;

  return (
    <div
      className={cx('art-table-footer', 'art-horizontal-scroll-container')}
      style={{ bottom: stickyBottom === 0 ? undefined : stickyBottom }}
    >
      <HtmlTable
        {...restProps}
        dataSource={dataSource}
        verticalRenderInfo={{
          offset: 0,
          first: 0,
          last,
          limit: Infinity,
        }}
        htmlTag="tfoot"
      />
    </div>
  );
};

export default tableFooter;
