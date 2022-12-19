import { createElement, CSSProperties, FC, ReactNode, useMemo } from 'react';

import cx from 'classnames';

import SpanManager from '@/components/ali-react-table/utils/spanManager';
import Colgroup from '@/components/ali-react-table/component/col-group';
import {
  RenderInfo,
  ArtColumn,
  VisibleColumnDescriptor,
} from '@/components/ali-react-table/interfaces';
import { safeGetRowKey, safeGetValue } from '@/components/ali-react-table/utils/safe';
import { ArtTableProps } from '@/components/ali-react-table/art-table';
import MeasureRow, { MeasureCellProps } from '@/components/ali-react-table/component/measure-row';

export interface HtmlTableProps
  extends Required<Pick<ArtTableProps, 'getRowProps' | 'primaryKey'>>,
    Partial<Pick<MeasureCellProps, 'onColumnResize'>> {
  columns: VisibleColumnDescriptor[];
  dataSource: any[];
  htmlTag: 'tbody' | 'tfoot';
  horizontalRenderInfo: Pick<
    RenderInfo,
    'flat' | 'horizontalRenderRange' | 'stickyLeftMap' | 'stickyRightMap'
  >;
  verticalRenderInfo: {
    offset: number;
    first: number;
    last: number;
    limit: number;
  };
  style?: CSSProperties;
}

const HtmlTable: FC<HtmlTableProps> = ({
  getRowProps,
  primaryKey,
  dataSource,
  verticalRenderInfo,
  horizontalRenderInfo,
  columns,
  htmlTag,
  onColumnResize,
  style,
}) => {
  const { flat, horizontalRenderRange: hoz, stickyRightMap, stickyLeftMap } = horizontalRenderInfo;

  const spanManager = new SpanManager();
  const fullFlatCount = flat.full.length;
  const leftFlatCount = flat.left.length;
  const rightFlatCount = flat.right.length;

  const { offset, first, last, limit } = verticalRenderInfo || {};

  const renderBodyCell = (row: any, rowIndex: number, column: ArtColumn, colIndex: number) => {
    if (spanManager.testSkip(rowIndex, colIndex)) {
      return null;
    }

    const value = safeGetValue(column, row, rowIndex);
    const cellProps = column.getCellProps?.(value, row, rowIndex) ?? {};

    let cellContent: ReactNode = value;
    if (column.render) {
      cellContent = column.render(value, row, rowIndex);
    }

    let colSpan = 1;
    let rowSpan = 1;
    if (column.getSpanRect) {
      const spanRect = column.getSpanRect(value, row, rowIndex);
      colSpan = spanRect == null ? 1 : spanRect.right - colIndex;
      rowSpan = spanRect == null ? 1 : spanRect.bottom - rowIndex;
    } else {
      if (cellProps.colSpan != null) {
        colSpan = cellProps.colSpan;
      }
      if (cellProps.rowSpan != null) {
        rowSpan = cellProps.rowSpan;
      }
    }

    // rowSpan/colSpan 不能过大，避免 rowSpan/colSpan 影响因虚拟滚动而未渲染的单元格
    rowSpan = Math.min(rowSpan, limit - rowIndex);
    colSpan = Math.min(colSpan, leftFlatCount + hoz.rightIndex - colIndex);

    const hasSpan = colSpan > 1 || rowSpan > 1;
    if (hasSpan) {
      spanManager.add(rowIndex, colIndex, colSpan, rowSpan);
    }

    const positionStyle: CSSProperties = {};

    if (colIndex < leftFlatCount) {
      positionStyle.position = 'sticky';
      positionStyle.left = stickyLeftMap.get(colIndex);
    } else if (colIndex >= fullFlatCount - rightFlatCount) {
      positionStyle.position = 'sticky';
      positionStyle.right = stickyRightMap.get(colIndex);
    }

    const tdProps = {
      ...cellProps,
      className: cx('art-art-table-cell', cellProps.className, {
        first: colIndex === 0,
        last: colIndex + colSpan === fullFlatCount,
        'lock-left': colIndex < leftFlatCount,
        'lock-right': colIndex >= fullFlatCount - rightFlatCount,
      }),
      ...(hasSpan ? { colSpan, rowSpan } : null),
      style: {
        textAlign: column.align,
        ...cellProps.style,
        ...positionStyle,
      },
      children: cellContent,
    };

    return <td key={colIndex} {...tdProps} />;
  };

  const renderRow = (row: any, i: number) => {
    const rowIndex = offset + i;
    spanManager.stripUpwards(rowIndex);

    const rowProps = getRowProps?.(row, rowIndex);
    const rowClass = cx(
      'art-art-table-row',
      {
        first: rowIndex === first,
        last: rowIndex === last,
        even: rowIndex % 2 === 0,
        odd: rowIndex % 2 === 1,
      },
      rowProps?.className,
    );

    const trProps = {
      ...rowProps,
      className: rowClass,
      'data-rowindex': rowIndex,
      children: columns.map((descriptor) => {
        if (descriptor.type === 'blank') {
          return <td key={descriptor.blankSide} />;
        }
        return renderBodyCell(row, rowIndex, descriptor.col, descriptor.colIndex);
      }),
    };

    const key = safeGetRowKey(primaryKey, row, rowIndex);
    return <tr key={key} {...trProps} />;
  };

  const body = createElement(htmlTag, null, (dataSource || []).map(renderRow));

  return (
    <table
      style={{
        width: 'max-content',
        minWidth: '100%',
        tableLayout: 'fixed',
      }}
    >
      <Colgroup columns={columns} />
      {body}
    </table>
  );
};

export default HtmlTable;
