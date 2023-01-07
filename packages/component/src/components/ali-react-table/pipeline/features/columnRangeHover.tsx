import { CellProps, HoverRange } from '../../interfaces';
import { isLeafNode, makeRecursiveMapper, mergeCellProps } from '../../utils';
import { TablePipeline } from '../pipeline';

const EMPTY_RANGE: HoverRange = {
  start: -1,
  end: -1,
} as const;

export interface ColumnRangeHoverFeatureOptions {
  /** 非受控用法：默认的悬停范围 */
  defaultHoverRange?: HoverRange;

  /** 受控用法：当前悬停范围 */
  hoverRange?: HoverRange;

  /** 受控用法：悬停渲染改变的回调 */
  onChangeHoverRange?(nextColIndexRange: HoverRange): void;
}

export function columnRangeHover(opts: ColumnRangeHoverFeatureOptions = {}) {
  const stateKey = 'columnHover';

  return function columnRangeHoverStep(pipeline: TablePipeline) {
    const hoverRange =
      opts.hoverRange ?? pipeline.getStateAtKey(stateKey) ?? opts.defaultHoverRange ?? EMPTY_RANGE;

    const onChangeHoverRange = (nextColIndexRange: HoverRange) => {
      pipeline.setStateAtKey(stateKey, nextColIndexRange);
      opts.onChangeHoverRange?.(nextColIndexRange);
    };

    return pipeline.mapColumns(
      makeRecursiveMapper((col, { startIndex, endIndex }) => {
        const colRange = { start: startIndex, end: endIndex };
        const match = colRange.end > hoverRange.start && hoverRange.end > colRange.start;

        if (!isLeafNode(col)) {
          return {
            ...col,
            headerCellProps: mergeCellProps(col.headerCellProps, {
              onMouseEnter() {
                onChangeHoverRange(colRange);
              },
              onMouseLeave() {
                onChangeHoverRange(EMPTY_RANGE);
              },
              className: match ? 'art-art-table-cell-hover' : '',
            }),
          };
        }

        const prevGetCellProps = col.getCellProps;

        return {
          ...col,
          headerCellProps: mergeCellProps(col.headerCellProps, {
            onMouseEnter() {
              onChangeHoverRange(colRange);
            },
            onMouseLeave() {
              onChangeHoverRange(EMPTY_RANGE);
            },
            className: match ? 'art-art-table-cell-hover' : '',
          }),

          getCellProps(value: any, record: any, rowIndex: number): CellProps {
            const prevCellProps = prevGetCellProps?.(value, record, rowIndex);

            return mergeCellProps(prevCellProps, {
              onMouseEnter() {
                onChangeHoverRange(colRange);
              },
              onMouseLeave() {
                onChangeHoverRange(EMPTY_RANGE);
              },
              className: match ? 'art-art-table-cell-hover' : '',
            });
          },
        };
      }),
    );
  };
}
