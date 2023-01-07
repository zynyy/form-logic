import { RenderInfo } from '@/components/ali-react-table/interfaces';
import React, { CSSProperties, FC } from 'react';
import cx from 'classnames';
import { calculateHeaderRenderInfo } from '@/components/ali-react-table/utils/calculations';
import { getTreeDepth } from '@/components/ali-react-table/utils';

interface TableHeaderProps {
  stickyTop: number;
  hasHeader: boolean;
  horizontalRenderInfo: Pick<
    RenderInfo,
    | 'horizontalRenderRange'
    | 'resolvedUseVirtual'
    | 'nested'
    | 'flat'
    | 'stickyLeftMap'
    | 'stickyRightMap'
  >;
}

const TableHeader: FC<TableHeaderProps> = ({ stickyTop, hasHeader, horizontalRenderInfo }) => {
  const { horizontalRenderRange, resolvedUseVirtual, nested, flat, stickyLeftMap, stickyRightMap } =
    horizontalRenderInfo || {};
  const rowCount = getTreeDepth(nested.full) + 1;

  const headerRenderInfo = calculateHeaderRenderInfo(
    {
      nested,
      flat,
      horizontalRenderRange,
      resolvedUseVirtual,
    },
    rowCount,
  );

  const fullFlatCount = flat.full.length;
  const leftFlatCount = flat.left.length;
  const rightFlatCount = flat.right.length;

  const thead = headerRenderInfo.leveled.map((wrappedCols, level) => {
    const headerCells = wrappedCols.map((wrapped) => {
      if (wrapped.type === 'normal') {
        const { colIndex, colSpan, isLeaf, col } = wrapped;

        const headerCellProps = col.headerCellProps ?? {};

        const positionStyle: CSSProperties = {};
        if (colIndex < leftFlatCount) {
          positionStyle.position = 'sticky';
          positionStyle.left = stickyLeftMap.get(colIndex);
        } else if (colIndex >= fullFlatCount - rightFlatCount) {
          positionStyle.position = 'sticky';
          positionStyle.right = stickyRightMap.get(colIndex + colSpan - 1);
        }

        return (
          <th
            key={colIndex}
            {...headerCellProps}
            className={cx('art-table-header-cell', headerCellProps.className, {
              first: colIndex === 0,
              last: colIndex + colSpan === fullFlatCount,
              'lock-left': colIndex < leftFlatCount,
              'lock-right': colIndex >= fullFlatCount - rightFlatCount,
            })}
            colSpan={colSpan}
            rowSpan={isLeaf ? rowCount - level : undefined}
            style={{
              textAlign: col.align,
              ...headerCellProps.style,
              ...positionStyle,
            }}
          >
            {col.title ?? col.name}
          </th>
        );
      } else {
        if (wrapped.width > 0) {
          return <th key={wrapped.blankSide} />;
        } else {
          return null;
        }
      }
    });

    return (
      <tr
        key={level}
        className={cx('art-table-header-row', {
          first: level === 0,
          last: level === rowCount - 1,
        })}
      >
        {headerCells}
      </tr>
    );
  });


  return (
    <div
      className={cx('art-table-header', 'no-scrollbar')}
      style={{
        top: stickyTop === 0 ? undefined : stickyTop,
        display: hasHeader ? undefined : 'none',
      }}
    >
      <table
        style={{
          width: 'max-content',
          minWidth: '100%',
          tableLayout: 'fixed',
        }}
      >
        <colgroup>
          {headerRenderInfo.flat.map((wrapped) => {
            if (wrapped.type === 'blank') {
              if (wrapped.width > 0) {
                return <col key={wrapped.blankSide} style={{ width: wrapped.width }} />;
              } else {
                return null;
              }
            } else {
              return <col key={wrapped.colIndex} style={{ width: wrapped.width }} />;
            }
          })}
        </colgroup>
        <thead>{thead}</thead>
      </table>
    </div>
  );
};

export default TableHeader;
