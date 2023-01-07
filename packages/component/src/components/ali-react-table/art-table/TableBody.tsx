import cx from 'classnames';
import React, { FC } from 'react';
import EmptyHtmlTable, {
  EmptyHtmlTableProps,
} from '@/components/ali-react-table/component/empty-html-table';
import HtmlTable, { HtmlTableProps } from '@/components/ali-react-table/component/html-table';
import { RenderInfo } from '@/components/ali-react-table/interfaces';

interface TableBodyProps
  extends Omit<HtmlTableProps, 'verticalRenderInfo' | "htmlTag">,
    EmptyHtmlTableProps,
    Pick<RenderInfo, 'verticalRenderRange'> {
  noScrollbar?: boolean;
}

const TableBody: FC<TableBodyProps> = ({
  dataSource,
  columns,
  getRowProps,
  primaryKey,
  loading,
  emptyCellHeight,
  noScrollbar,
  horizontalRenderInfo,
  verticalRenderRange,
}) => {

  const handleColumnResize = (sizes) => {
    console.log(sizes)
  }


  const tableBodyClassName = cx('art-table-body', 'art-horizontal-scroll-container', {
    'no-scrollbar': noScrollbar,
  });

  if (dataSource.length === 0) {
    return (
      <div className={tableBodyClassName}>
        <EmptyHtmlTable columns={columns} loading={loading} emptyCellHeight={emptyCellHeight} />
      </div>
    );
  }

  const { topIndex, bottomBlank, topBlank, bottomIndex } = verticalRenderRange;

  return (
    <div className={tableBodyClassName}>
      {topBlank > 0 && (
        <div
          key="top-blank"
          className={cx('art-virtual-blank', 'top')}
          style={{ height: topBlank }}
        />
      )}
      <HtmlTable
        columns={columns}
        dataSource={dataSource}
        getRowProps={getRowProps}
        primaryKey={primaryKey}
        horizontalRenderInfo={horizontalRenderInfo}
        onColumnResize={handleColumnResize}
        verticalRenderInfo={{
          first: 0,
          offset: topIndex,
          limit: bottomIndex,
          last: dataSource.length - 1,
        }}
        htmlTag="tbody"
      />
      {bottomBlank > 0 && (
        <div
          key="bottom-blank"
          className={cx('art-virtual-blank', 'bottom')}
          style={{ height: bottomBlank }}
        />
      )}
    </div>
  );
};

export default TableBody;
